// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler from "../../api/generar-ejercicios";

type DeepSeekStub = {
  status?: number;
  body?: unknown;
  throws?: boolean;
};

function stubFetch(responder: (body: Record<string, unknown>) => DeepSeekStub) {
  const calls: Record<string, unknown>[] = [];
  const impl = vi.fn(async (_url: string, init: RequestInit) => {
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    calls.push(body);
    const r = responder(body);
    if (r.throws) throw new TypeError("fetch failed");
    return new Response(JSON.stringify(r.body ?? {}), {
      status: r.status ?? 200,
      headers: { "Content-Type": "application/json" },
    });
  });
  vi.stubGlobal("fetch", impl);
  return { calls, impl };
}

function post(pregunta = "Resuelve 2x + 5 = 13"): Request {
  return new Request("https://cyberedumx.com/api/generar-ejercicios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pregunta }),
  });
}

function completion(content: string): DeepSeekStub {
  return { body: { choices: [{ message: { content }, finish_reason: "stop" }] } };
}

const TEXTO_VALIDO = [
  "1. Resuelve 3x + 2 = 11",
  "   A. x = 2",
  "   B. x = 3",
  "   C. x = 4",
  "   D. x = 5",
  "   Respuesta correcta: b",
  "",
  "2. Resuelve 4x - 1 = 15",
  "   A. x = 3",
  "   B. x = 4",
  "   C. x = 5",
  "   D. x = 6",
  "   Respuesta correcta: b",
].join("\n");

const KEY = "DEEPSEEK_API_KEY";

beforeEach(() => {
  process.env[KEY] = "sk-test-key-1234567890";
  delete process.env.DEEPSEEK_MODEL;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete process.env[KEY];
  delete process.env.DEEPSEEK_MODEL;
});

describe("GET /api/generar-ejercicios — diagnóstico", () => {
  it("reporta la key presente sin exponer su valor", async () => {
    const res = await handler(
      new Request("https://cyberedumx.com/api/generar-ejercicios", { method: "GET" }),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.deepseekKey.present).toBe(true);
    expect(body.deepseekKey.source).toBe(KEY);
    expect(body.deepseekKey.length).toBe("sk-test-key-1234567890".length);
    expect(JSON.stringify(body)).not.toContain("sk-test-key-1234567890");
  });

  it("reporta 503 cuando la variable no está configurada", async () => {
    delete process.env[KEY];
    const res = await handler(
      new Request("https://cyberedumx.com/api/generar-ejercicios", { method: "GET" }),
    );
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.deepseekKey.present).toBe(false);
    expect(body.deepseekKey.source).toBeNull();
  });
});

describe("POST /api/generar-ejercicios", () => {
  it("devuelve ejercicios estructurados desde la respuesta JSON del modelo", async () => {
    const json = JSON.stringify({
      ejercicios: [
        { pregunta: "Resuelve 3x + 2 = 11", opciones: ["2", "3", "4", "5"], correcta: 1 },
        { pregunta: "Resuelve 4x - 1 = 15", opciones: ["3", "4", "5", "6"], correcta: 1 },
      ],
    });
    const { calls } = stubFetch(() => completion(json));

    const res = await handler(post());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.mode).toBe("json");
    expect(body.ejercicios).toHaveLength(2);
    expect(body.ejercicios[0]).toMatchObject({
      pregunta: "Resuelve 3x + 2 = 11",
      opcion_a: "2",
      opcion_b: "3",
      respuesta_correcta: "b",
    });
    // El primer intento debe pedir JSON estructurado
    expect(calls[0].response_format).toEqual({ type: "json_object" });
    expect(calls[0].max_tokens).toBe(1200);
  });

  it("cae al parser de texto cuando el modelo no devuelve JSON", async () => {
    const { calls } = stubFetch(() => completion(TEXTO_VALIDO));

    const res = await handler(post());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ejercicios).toHaveLength(2);
    expect(body.ejercicios[1].pregunta).toBe("Resuelve 4x - 1 = 15");
    expect(body.ejercicios[1].respuesta_correcta).toBe("b");
    // Se reporta el formato que realmente funcionó
    expect(body.mode).toBe("text");
    // Un solo intento: pidió JSON y supo reinterpretar la respuesta como texto
    expect(calls).toHaveLength(1);
    expect(calls[0].response_format).toEqual({ type: "json_object" });
  });

  it("acepta formatos alternativos de opciones y de respuesta", async () => {
    const alterno = [
      "Ejercicio 1",
      "¿Cuánto es 7 x 8?",
      "A) 54",
      "B) 56",
      "C) 58",
      "D) 60",
      "Respuesta: opción B",
      "",
      "Ejercicio 2",
      "¿Cuánto es 9 x 9?",
      "A) 79",
      "B) 80",
      "C) 81",
      "D) 82",
      "Clave: c",
    ].join("\n");
    stubFetch(() => completion(alterno));

    const res = await handler(post());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ejercicios).toHaveLength(2);
    expect(body.ejercicios[0].opcion_b).toBe("56");
    expect(body.ejercicios[0].respuesta_correcta).toBe("b");
    expect(body.ejercicios[1].respuesta_correcta).toBe("c");
  });

  it("no marca respuesta cuando el modelo no la indica", async () => {
    const sinRespuesta = [
      "1. ¿Cuánto es 2 + 2?",
      "   A. 3",
      "   B. 4",
      "   C. 5",
      "   D. 6",
    ].join("\n");
    stubFetch(() => completion(sinRespuesta));

    const res = await handler(post());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ejercicios[0].respuesta_correcta).toBeNull();
  });

  it("reintenta con el siguiente modelo cuando el primero es rechazado", async () => {
    const json = JSON.stringify({
      ejercicios: [{ pregunta: "P", opciones: ["a1", "b1", "c1", "d1"], correcta: 0 }],
    });
    const { calls } = stubFetch((body) =>
      body.model === "deepseek-v4-flash"
        ? { status: 400, body: { error: { message: "Model Not Exist" } } }
        : completion(json),
    );

    const res = await handler(post());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.model).toBe("deepseek-chat");
    expect(calls.some((c) => c.model === "deepseek-chat")).toBe(true);
  });

  it("respeta DEEPSEEK_MODEL como override", async () => {
    process.env.DEEPSEEK_MODEL = "deepseek-chat";
    const json = JSON.stringify({
      ejercicios: [{ pregunta: "P", opciones: ["a1", "b1", "c1", "d1"], correcta: 2 }],
    });
    const { calls } = stubFetch(() => completion(json));

    const res = await handler(post());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(calls[0].model).toBe("deepseek-chat");
    expect(body.model).toBe("deepseek-chat");
    expect(body.ejercicios[0].respuesta_correcta).toBe("c");
  });

  it("devuelve 502 con el detalle real cuando todos los intentos fallan", async () => {
    stubFetch(() => ({ status: 401, body: { error: { message: "Authentication Fails" } } }));

    const res = await handler(post());
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.ok).toBe(false);
    expect(body.stage).toBe("deepseek");
    expect(body.detail).toContain("401");
    expect(body.detail).toContain("Authentication Fails");
    expect(body.attempts.length).toBeGreaterThanOrEqual(2);
  });

  it("convierte un fallo de red en un error explícito, no en una respuesta vacía", async () => {
    stubFetch(() => ({ throws: true }));

    const res = await handler(post());
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.ok).toBe(false);
    expect(body.detail).toContain("network_error");
  });

  it("devuelve 503 explícito cuando falta la API key", async () => {
    delete process.env[KEY];
    const { impl } = stubFetch(() => completion(TEXTO_VALIDO));

    const res = await handler(post());
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.stage).toBe("config");
    expect(body.detail).toContain("DEEPSEEK_API_KEY");
    expect(impl).not.toHaveBeenCalled();
  });

  it("rechaza peticiones sin pregunta", async () => {
    const res = await handler(
      new Request("https://cyberedumx.com/api/generar-ejercicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
    );
    expect(res.status).toBe(400);
  });
});
