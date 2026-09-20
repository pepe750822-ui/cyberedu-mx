// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler from "../../api/video-content";

type Llamada = { url: string; body: Record<string, unknown> | null };

/**
 * Simula las tres llamadas de red del endpoint:
 *  - GET  {UPSTASH}/get/{clave}   → miss de caché
 *  - POST {UPSTASH}/pipeline      → escritura de caché
 *  - POST api.deepseek.com        → respuesta del modelo
 */
function stubRed(): Llamada[] {
  const llamadas: Llamada[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      const u = String(url);
      let body: Record<string, unknown> | null = null;
      if (init?.body) {
        try {
          body = JSON.parse(String(init.body)) as Record<string, unknown>;
        } catch {
          body = null;
        }
      }
      llamadas.push({ url: u, body });

      if (u.includes("api.deepseek.com")) {
        return new Response(
          JSON.stringify({ choices: [{ message: { content: "paso 1\npaso 2\nresultado" } }] }),
          { status: 200 },
        );
      }
      if (u.includes("/get/")) {
        return new Response(JSON.stringify({ result: null }), { status: 200 });
      }
      return new Response(JSON.stringify([{ result: "OK" }]), { status: 200 });
    }),
  );
  return llamadas;
}

function post(payload: Record<string, unknown>): Request {
  return new Request("https://cyberedumx.com/api/video-content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function promptEnviado(llamadas: Llamada[]): string {
  const ds = llamadas.find((l) => l.url.includes("api.deepseek.com"));
  const messages = ds?.body?.messages as { content: string }[] | undefined;
  return messages?.[0]?.content ?? "";
}

function clavesDeCache(llamadas: Llamada[]): string[] {
  return llamadas.filter((l) => l.url.includes("/get/")).map((l) => decodeURIComponent(l.url));
}

const ENV_CACHE = {
  KV_REST_API_URL: "https://cache.test",
  KV_REST_API_TOKEN: "token-test",
};

beforeEach(() => {
  process.env.DEEPSEEK_API_KEY = "sk-test-key";
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete process.env.DEEPSEEK_API_KEY;
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

describe("POST /api/video-content", () => {
  it("sin 'modo' mantiene la explicación larga que usa VideoSubindice", async () => {
    const llamadas = stubRed();

    const res = await handler(post({ titulo: "Ecuaciones lineales", materia: "Matemáticas" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.content).toBe("paso 1\npaso 2\nresultado");

    const prompt = promptEnviado(llamadas);
    expect(prompt).toContain("ECOEMS 2027");
    expect(prompt).toContain("2-3 párrafos");
    expect(prompt).not.toContain("Muestra SOLO el desarrollo paso a paso");
  });

  it("con modo 'desarrollo' usa el prompt corto paso a paso", async () => {
    const llamadas = stubRed();

    const res = await handler(
      post({ titulo: "Resuelve 2x + 5 = 13", materia: "Matemáticas IV ENP UNAM", modo: "desarrollo" }),
    );

    expect(res.status).toBe(200);

    const prompt = promptEnviado(llamadas);
    expect(prompt).toContain("Eres profesor de Matemáticas IV ENP UNAM.");
    expect(prompt).toContain("Muestra SOLO el desarrollo paso a paso para resolver este ejercicio.");
    expect(prompt).toContain("Máximo 5 líneas. Sin explicar opciones incorrectas.");
    expect(prompt).toContain("Sin introducción. Solo los pasos.");
    // El desarrollo se muestra como texto plano: nada de \( \) ni \[ \]
    expect(prompt).toContain("Sin notación LaTeX.");
    expect(prompt).toContain("Usa solo texto y símbolos simples como ×, ÷, =, ^, { }");
    // El enunciado del ejercicio viaja en el prompt
    expect(prompt).toContain("Resuelve 2x + 5 = 13");
    // No debe arrastrar el prompt largo
    expect(prompt).not.toContain("ECOEMS 2027");
  });

  it("no pide la restricción de LaTeX en la explicación larga", async () => {
    const llamadas = stubRed();

    await handler(post({ titulo: "Ecuaciones", materia: "Matemáticas" }));

    // VideoSubindice mantiene su prompt sin cambios
    expect(promptEnviado(llamadas)).not.toContain("Sin notación LaTeX");
  });

  it("el prompt de desarrollo usa la materia recibida, no Matemáticas IV fijo", async () => {
    const llamadas = stubRed();

    await handler(
      post({ titulo: "Un bloque cae desde 20 m", materia: "Física IV ENP UNAM", modo: "desarrollo" }),
    );

    const prompt = promptEnviado(llamadas);
    expect(prompt).toContain("Eres profesor de Física IV ENP UNAM.");
    expect(prompt).not.toContain("Matemáticas IV");
  });

  it("un 'modo' desconocido cae en la explicación larga", async () => {
    const llamadas = stubRed();

    await handler(post({ titulo: "Tema", materia: "Materia", modo: "cualquiera" }));

    expect(promptEnviado(llamadas)).toContain("ECOEMS 2027");
  });

  it("separa la caché por modo para que no se pisen las respuestas", async () => {
    Object.assign(process.env, ENV_CACHE);
    const llamadas = stubRed();

    await handler(post({ titulo: "Resuelve 2x = 8", materia: "Matemáticas" }));
    await handler(post({ titulo: "Resuelve 2x = 8", materia: "Matemáticas", modo: "desarrollo" }));

    const claves = clavesDeCache(llamadas);
    expect(claves).toHaveLength(2);
    expect(claves[0]).not.toBe(claves[1]);
    // El prompt largo no cambió: conserva su caché en vc3
    expect(claves[0]).toContain("vc3:exp:");
    // El prompt de desarrollo cambió (anti-LaTeX) → vc4 fuerza regenerar
    expect(claves[1]).toContain("vc4:des:");
  });

  it("rechaza peticiones sin titulo o materia", async () => {
    stubRed();

    const res = await handler(post({ titulo: "Solo título" }));

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("requeridos");
  });
});
