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

function post(
  pregunta = "Resuelve 2x + 5 = 13",
  extra: Record<string, unknown> = {},
): Request {
  return new Request("https://cyberedumx.com/api/generar-ejercicios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pregunta, ...extra }),
  });
}

function completion(content: string): DeepSeekStub {
  return { body: { choices: [{ message: { content }, finish_reason: "stop" }] } };
}

/** Extrae el texto del prompt enviado a DeepSeek. */
function promptDe(call: Record<string, unknown>): string {
  const messages = call.messages as { content: string }[] | undefined;
  return messages?.[0]?.content ?? "";
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

    // El prompt debe pedir un desarrollo breve y sin opciones incorrectas
    const prompt = promptDe(calls[0]);
    expect(prompt).toContain("SOLO el desarrollo paso a paso");
    expect(prompt).toContain("Sin mencionar opciones incorrectas");
    expect(prompt).toContain("Máximo 5 líneas");
    expect(prompt).toContain('"desarrollo"');
    expect(prompt).toContain(
      "Sin notación LaTeX ni símbolos matemáticos especiales. Usa solo texto plano: ×, ÷, =, ^",
    );
  });

  it("el prompt de texto pide el formato con bloque Desarrollo", async () => {
    const { calls } = stubFetch((body) =>
      body.response_format
        ? completion("No puedo generar ejercicios.")
        : completion(
            [
              "Ejercicio 1: Resuelve 2x + 5 = 13",
              "A) 2 B) 3 C) 4 D) 5",
              "Desarrollo:",
              "2x = 8",
              "x = 4",
              "Respuesta correcta: C",
            ].join("\n"),
          ),
    );

    const res = await handler(post());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.mode).toBe("text");
    expect(calls).toHaveLength(2);

    const prompt = promptDe(calls[1]);
    expect(prompt).toContain("Eres profesor de Matemáticas IV ENP UNAM");
    expect(prompt).toContain("Sin mencionar opciones incorrectas");
    expect(prompt).toContain("Máximo 5 líneas por ejercicio");
    expect(prompt).toContain("Desarrollo:");
    expect(prompt).toContain("Respuesta correcta: [letra]");
    expect(prompt).toContain(
      "Sin notación LaTeX ni símbolos matemáticos especiales. Usa solo texto plano: ×, ÷, =, ^",
    );
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

  it("parsea el formato con bloque Desarrollo y opciones en una sola línea", async () => {
    // Formato exacto que pide el prompt:
    //   Ejercicio 1: [pregunta]
    //   A) ... B) ... C) ... D) ...
    //   Desarrollo: / [paso] / Respuesta correcta: [letra]
    const formato = [
      "Ejercicio 1: Resuelve 2x + 5 = 13",
      "A) 2 B) 3 C) 4 D) 5",
      "Desarrollo:",
      "2x = 13 - 5",
      "2x = 8",
      "x = 4",
      "Respuesta correcta: C",
      "",
      "Ejercicio 2: Resuelve 3x - 4 = 11",
      "A) 3 B) 4 C) 5 D) 6",
      "Desarrollo:",
      "3x = 11 + 4",
      "3x = 15",
      "x = 5",
      "Respuesta correcta: C",
    ].join("\n");
    stubFetch(() => completion(formato));

    const res = await handler(post());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ejercicios).toHaveLength(2);

    // Las cuatro opciones se separaron correctamente
    expect(body.ejercicios[0]).toMatchObject({
      pregunta: "Resuelve 2x + 5 = 13",
      opcion_a: "2",
      opcion_b: "3",
      opcion_c: "4",
      opcion_d: "5",
      respuesta_correcta: "c",
    });

    // Los pasos NO se mezclaron con la pregunta ni con las opciones
    expect(body.ejercicios[0].desarrollo).toBe("2x = 13 - 5\n2x = 8\nx = 4");
    expect(body.ejercicios[0].pregunta).not.toContain("Desarrollo");

    // El segundo ejercicio no se perdió ni se contaminó con el anterior
    expect(body.ejercicios[1]).toMatchObject({
      pregunta: "Resuelve 3x - 4 = 11",
      respuesta_correcta: "c",
    });
    expect(body.ejercicios[1].desarrollo).toBe("3x = 11 + 4\n3x = 15\nx = 5");
  });

  it("lee el desarrollo del JSON cuando el modelo lo devuelve ahí", async () => {
    const json = JSON.stringify({
      ejercicios: [
        {
          pregunta: "Resuelve x + 1 = 3",
          opciones: ["1", "2", "3", "4"],
          desarrollo: "x = 3 - 1\nx = 2",
          correcta: 1,
        },
      ],
    });
    stubFetch(() => completion(json));

    const res = await handler(post());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.mode).toBe("json");
    expect(body.ejercicios[0].desarrollo).toBe("x = 3 - 1\nx = 2");
    expect(body.ejercicios[0].respuesta_correcta).toBe("b");
  });

  it("acepta el desarrollo como arreglo de pasos", async () => {
    const json = JSON.stringify({
      ejercicios: [
        {
          pregunta: "Resuelve x + 1 = 3",
          opciones: ["1", "2", "3", "4"],
          desarrollo: ["x = 3 - 1", "x = 2"],
          correcta: 1,
        },
      ],
    });
    stubFetch(() => completion(json));

    const res = await handler(post());
    const body = await res.json();

    expect(body.ejercicios[0].desarrollo).toBe("x = 3 - 1\nx = 2");
  });

  it("deja el desarrollo vacío si el modelo no lo incluye", async () => {
    stubFetch(() => completion(TEXTO_VALIDO));

    const res = await handler(post());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ejercicios[0].desarrollo).toBe("");
  });

  it("usa la materia recibida en el prompt para no sesgar otras materias", async () => {
    const json = JSON.stringify({
      ejercicios: [{ pregunta: "P", opciones: ["a1", "b1", "c1", "d1"], correcta: 0 }],
    });
    const { calls } = stubFetch(() => completion(json));

    const res = await handler(post("Un bloque de 5 kg cae desde 20 m", { materia: "Física IV ENP UNAM" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    const prompt = promptDe(calls[0]);
    expect(prompt).toContain("Eres profesor de Física IV ENP UNAM.");
    expect(prompt).not.toContain("Matemáticas IV");
    expect(body.ejercicios).toHaveLength(1);
  });

  it("añade el nivel ENP UNAM cuando la materia de la tabla viene sin él", async () => {
    const json = JSON.stringify({
      ejercicios: [{ pregunta: "P", opciones: ["a1", "b1", "c1", "d1"], correcta: 0 }],
    });
    const { calls } = stubFetch(() => completion(json));

    // "Matemáticas IV" es el valor real que guarda preguntas_prepa.materia
    await handler(post("Resuelve 2x + 5 = 13", { materia: "Matemáticas IV" }));

    const prompt = promptDe(calls[0]);
    expect(prompt).toContain("Eres profesor de Matemáticas IV ENP UNAM.");
    // No debe duplicar el contexto
    expect(prompt).not.toContain("ENP UNAM ENP UNAM");
  });

  it("no duplica el nivel si la materia ya lo incluye", async () => {
    const json = JSON.stringify({
      ejercicios: [{ pregunta: "P", opciones: ["a1", "b1", "c1", "d1"], correcta: 0 }],
    });
    const { calls } = stubFetch(() => completion(json));

    await handler(post("Resuelve x", { materia: "Física IV ENP UNAM" }));

    const prompt = promptDe(calls[0]);
    expect(prompt).toContain("Eres profesor de Física IV ENP UNAM.");
    expect(prompt).not.toContain("ENP UNAM ENP UNAM");
  });

  it("conserva Matemáticas IV cuando el cliente no envía materia", async () => {
    const json = JSON.stringify({
      ejercicios: [{ pregunta: "P", opciones: ["a1", "b1", "c1", "d1"], correcta: 0 }],
    });
    const { calls } = stubFetch(() => completion(json));

    await handler(post());

    expect(promptDe(calls[0])).toContain("Eres profesor de Matemáticas IV ENP UNAM.");
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
