export const config = { runtime: 'edge' };

/**
 * Genera 2 ejercicios de práctica a partir de una pregunta del simulador.
 *
 * Endpoint:
 *   POST /api/generar-ejercicios   body: { pregunta: string, debug?: boolean }
 *   GET  /api/generar-ejercicios          → diagnóstico de configuración (sin coste)
 *   GET  /api/generar-ejercicios?ping=1   → diagnóstico + llamada real (max_tokens: 1)
 *
 * Respuesta OK (200):
 *   { ok: true, ejercicios: Ejercicio[], raw: string, model: string, mode: 'json'|'text', ms: number }
 *
 * Respuesta de error (4xx/5xx):
 *   { ok: false, stage: 'config'|'request'|'deepseek'|'parse', error: string, detail?: string, attempts?: Attempt[] }
 */

type Ejercicio = {
  pregunta: string;
  opcion_a: string;
  opcion_b: string;
  opcion_c: string;
  opcion_d: string;
  respuesta_correcta: string | null; // 'a'|'b'|'c'|'d' — null si no se pudo determinar
};

type Attempt = {
  model: string;
  mode: 'json' | 'text';
  status: number | null;
  ok: boolean;
  ms: number;
  error?: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

/** Nombres de variable aceptados, en orden de prioridad. */
const KEY_NAMES = ['DEEPSEEK_API_KEY', 'DEEPSEEK_KEY', 'DEEPSEEK_TOKEN', 'DEEPSEEK_SECRET'];

/** Modelos a probar, en orden. DEEPSEEK_MODEL permite override sin re-deploy de código. */
const DEFAULT_MODELS = ['deepseek-v4-flash', 'deepseek-chat'];

const UPSTREAM_TIMEOUT_MS = 20_000;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function env(): Record<string, string | undefined> {
  return (typeof process !== 'undefined' ? process.env : {}) as Record<string, string | undefined>;
}

function resolveApiKey(): { key: string | undefined; source: string | null } {
  const e = env();
  for (const name of KEY_NAMES) {
    const value = e[name];
    if (typeof value === 'string' && value.trim()) {
      return { key: value.trim(), source: name };
    }
  }
  return { key: undefined, source: null };
}

function resolveModels(): string[] {
  const override = env().DEEPSEEK_MODEL;
  const list = override && override.trim()
    ? [override.trim(), ...DEFAULT_MODELS]
    : [...DEFAULT_MODELS];
  return [...new Set(list)];
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function timeoutSignal(ms: number): AbortSignal | undefined {
  try {
    return AbortSignal.timeout(ms);
  } catch {
    return undefined;
  }
}

/** Nunca registramos la API key; solo su longitud para detectar valores truncados. */
function keyFingerprint(key: string | undefined): string {
  if (!key) return 'MISSING';
  return `present(len=${key.length}, prefix=${key.slice(0, 3)}…)`;
}

function log(event: string, data: Record<string, unknown> = {}): void {
  try {
    console.log(`[generar-ejercicios] ${event} ${JSON.stringify(data)}`);
  } catch {
    console.log(`[generar-ejercicios] ${event}`);
  }
}

// ─────────────────────────────────────────────────────────────
// Parseo del texto devuelto por el modelo
// ─────────────────────────────────────────────────────────────

function normalizar(texto: string): string {
  return texto
    .replace(/\r\n?/g, '\n')
    .replace(/```[a-zA-Z]*\n?/g, '')
    .replace(/\*\*|__/g, '')
    .replace(/[ \t\u00a0]+$/gm, '')
    .trim();
}

const NUMBER_LINE_RE = /^\s*(\d{1,2})\s*[.)-]\s+(.*)$/;
const OPTION_PAREN_RE = /^\s*\(([A-Da-d])\)\s*[.:-]?\s*(.+?)\s*$/;
const OPTION_DOT_RE = /^\s*([A-Da-d])\s*[.):-]\s*(.+?)\s*$/;
const BULLET_RE = /^\s*[-•*]\s+(.+?)\s*$/;
const ANSWER_LINE_RE =
  /^\s*(?:la\s+)?(?:respuesta\s+correcta|respuesta|correcta|clave|inciso|opci[oó]n)\s*(?::|-|—|es\b|=\s*)\s*(?:(?:opci[oó]n|inciso|letra)\s+)?\(?\s*([A-Da-d])\b/i;

function matchOpcion(linea: string): { letra: string; texto: string } | null {
  const m = linea.match(OPTION_PAREN_RE) ?? linea.match(OPTION_DOT_RE);
  if (!m) return null;
  const texto = m[2].trim();
  if (!texto) return null;
  return { letra: m[1].toLowerCase(), texto };
}

function toEjercicio(
  pregunta: string,
  opciones: Map<string, string>,
  respuesta: string | null,
): Ejercicio | null {
  const limpia = pregunta
    .replace(/^\s*\d{1,2}\s*[.)-]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!limpia) return null;
  if (opciones.size < 2) return null;
  return {
    pregunta: limpia,
    opcion_a: opciones.get('a') ?? '',
    opcion_b: opciones.get('b') ?? '',
    opcion_c: opciones.get('c') ?? '',
    opcion_d: opciones.get('d') ?? '',
    respuesta_correcta: respuesta,
  };
}

/**
 * Parser tolerante: acepta "1." / "1)" / "(A)" / "A." / "A)" / "A:" / viñetas,
 * con o sin numeración, y "Respuesta correcta: x" en cualquiera de sus variantes.
 */
function parseEjerciciosTexto(texto: string): Ejercicio[] {
  const contenido = normalizar(texto);
  if (!contenido) return [];

  const ejercicios: Ejercicio[] = [];
  let pregunta: string[] = [];
  let opciones = new Map<string, string>();
  let respuesta: string | null = null;
  let bullets = 0;
  const letrasBullet = ['a', 'b', 'c', 'd'];

  const flush = () => {
    const ej = toEjercicio(pregunta.join(' '), opciones, respuesta);
    if (ej) ejercicios.push(ej);
    pregunta = [];
    opciones = new Map<string, string>();
    respuesta = null;
    bullets = 0;
  };

  for (const linea of contenido.split('\n')) {
    const trimmed = linea.trim();
    if (!trimmed) continue;

    // 1) Nueva pregunta numerada → cierra la anterior
    const numerada = trimmed.match(NUMBER_LINE_RE);
    if (numerada) {
      flush();
      pregunta = [numerada[2]];
      continue;
    }

    // 2) Línea de respuesta correcta
    if (ANSWER_LINE_RE.test(trimmed)) {
      const m = trimmed.match(ANSWER_LINE_RE);
      if (m) respuesta = m[1].toLowerCase();
      continue;
    }

    // 3) Opción con letra
    const opcion = matchOpcion(trimmed);
    if (opcion) {
      // Una nueva "A" después de haber cerrado las opciones anteriores → nuevo ejercicio
      if (opcion.letra === 'a' && opciones.has('a')) flush();
      if (opciones.size === 0) respuesta = respuesta ?? null;
      opciones.set(opcion.letra, opcion.texto);
      continue;
    }

    // 4) Viñeta sin letra → se numera como opción mientras no haya letras
    const bullet = trimmed.match(BULLET_RE);
    if (bullet && opciones.size < 4 && !opciones.has('a')) {
      opciones.set(letrasBullet[bullets] ?? 'a', bullet[1].trim());
      bullets += 1;
      continue;
    }

    // 5) Texto libre: continúa la pregunta, o abre una nueva si ya había opciones
    if (opciones.size > 0) {
      flush();
      pregunta = [trimmed];
    } else {
      pregunta.push(trimmed);
    }
  }
  flush();

  return ejercicios;
}

function parseEjerciciosJson(texto: string): Ejercicio[] {
  let raw = normalizar(texto);
  if (!raw) return [];

  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) raw = fence[1].trim();

  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return [];

  let obj: unknown;
  try {
    obj = JSON.parse(raw.slice(start, end + 1));
  } catch {
    return [];
  }

  const contenedor = obj as Record<string, unknown>;
  const arr = Array.isArray(obj)
    ? obj
    : (contenedor.ejercicios ?? contenedor.exercises ?? contenedor.preguntas ?? contenedor.questions);
  if (!Array.isArray(arr)) return [];

  const out: Ejercicio[] = [];
  for (const item of arr) {
    const ej = parseJsonItem(item as Record<string, unknown>);
    if (ej) out.push(ej);
  }
  return out;
}

function parseJsonItem(item: Record<string, unknown>): Ejercicio | null {
  if (!item || typeof item !== 'object') return null;

  const pregunta = String(item.pregunta ?? item.question ?? item.texto ?? '').trim();
  if (!pregunta) return null;

  const crudas = (item.opciones ?? item.options ?? item.answers) as unknown;
  const textos: string[] = Array.isArray(crudas)
    ? crudas.map((o) => String(o ?? '').trim()).filter(Boolean)
    : [];
  if (textos.length < 2) return null;

  // Quita prefijos tipo "A)" si el modelo los incluyó dentro del array
  const limpias = textos.map((t) => {
    const m = t.match(OPTION_PAREN_RE) ?? t.match(OPTION_DOT_RE);
    return m ? m[2].trim() : t;
  }).slice(0, 4);

  let respuesta: string | null = null;
  const correcta = item.correcta ?? item.correct ?? item.answer ?? item.respuesta_correcta;
  if (typeof correcta === 'number' && correcta >= 0 && correcta <= 3) {
    respuesta = ['a', 'b', 'c', 'd'][correcta];
  } else if (typeof correcta === 'string') {
    const c = correcta.trim().toLowerCase();
    if (/^[a-d]$/.test(c)) respuesta = c;
    else if (/^[0-3]$/.test(c)) respuesta = ['a', 'b', 'c', 'd'][Number(c)];
  }

  const opciones = new Map<string, string>();
  ['a', 'b', 'c', 'd'].forEach((letra, i) => {
    if (limpias[i]) opciones.set(letra, limpias[i]);
  });

  return toEjercicio(pregunta, opciones, respuesta);
}

// ─────────────────────────────────────────────────────────────
// Prompts
// ─────────────────────────────────────────────────────────────

function promptJson(preguntaOriginal: string): string {
  return (
    `Eres un profesor de Matemáticas IV ENP UNAM.\n` +
    `Genera exactamente 2 ejercicios de opción múltiple, similares al ejercicio de referencia, ` +
    `para que el estudiante practique el mismo concepto.\n\n` +
    `Ejercicio de referencia:\n"""${preguntaOriginal}"""\n\n` +
    `Reglas:\n` +
    `- Cada ejercicio debe tener exactamente 4 opciones.\n` +
    `- La respuesta correcta NUNCA debe aparecer ni insinuarse dentro del texto de la pregunta ni de las opciones.\n` +
    `- Los ejercicios deben ser distintos entre sí.\n\n` +
    `Responde SOLO con JSON válido, sin markdown ni texto adicional, con este formato exacto:\n` +
    `{"ejercicios":[{"pregunta":"texto de la pregunta","opciones":["texto opción A","texto opción B","texto opción C","texto opción D"],"correcta":0}]}\n` +
    `"correcta" es el índice 0-based de la opción correcta (0=A, 1=B, 2=C, 3=D).`
  );
}

function promptTexto(preguntaOriginal: string): string {
  return (
    `Eres un profesor de Matemáticas IV ENP UNAM.\n` +
    `Genera 2 ejercicios similares SIN incluir la respuesta correcta dentro de la pregunta ni de las opciones. Solo pregunta y opciones en esas líneas.\n` +
    `Genera exactamente 2 ejercicios similares al siguiente para que el estudiante practique el mismo concepto:\n` +
    `${preguntaOriginal}\n\n` +
    `Para cada ejercicio, proporciona la pregunta seguida de las opciones A, B, C, D en líneas separadas.\n` +
    `La línea "Respuesta correcta" va SIEMPRE al final de cada ejercicio, en su propia línea, y nunca debe mencionarse ni insinuarse dentro del texto de la pregunta o de las opciones.\n` +
    `Formato para cada ejercicio:\n` +
    `1. Texto de la pregunta 1\n` +
    `   A. Opción A\n` +
    `   B. Opción B\n` +
    `   C. Opción C\n` +
    `   D. Opción D\n` +
    `   Respuesta correcta: [a/b/c/d]\n\n` +
    `2. Texto de la pregunta 2\n` +
    `   A. Opción A\n` +
    `   B. Opción B\n` +
    `   C. Opción C\n` +
    `   D. Opción D\n` +
    `   Respuesta correcta: [a/b/c/d]\n\n` +
    `No incluyas texto adicional ni bloques de Markdown fuera de los ejercicios. Solo el texto con el formato especificado.`
  );
}

// ─────────────────────────────────────────────────────────────
// Llamada a DeepSeek
// ─────────────────────────────────────────────────────────────

type DeepSeekResult = {
  ok: boolean;
  status: number;
  content: string;
  error?: string;
  detail?: string;
};

async function llamarDeepSeek(
  apiKey: string,
  model: string,
  prompt: string,
  jsonMode: boolean,
): Promise<DeepSeekResult> {
  const payload: Record<string, unknown> = {
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1200,
    temperature: 0.7,
  };
  if (jsonMode) payload.response_format = { type: 'json_object' };

  let res: Response;
  try {
    res = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: timeoutSignal(UPSTREAM_TIMEOUT_MS),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    return { ok: false, status: 0, content: '', error: 'network_error', detail: msg };
  }

  const texto = await res.text().catch(() => '');

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      content: '',
      error: `deepseek_http_${res.status}`,
      detail: texto.slice(0, 600),
    };
  }

  let parsed: {
    choices?: { message?: { content?: string }; finish_reason?: string }[];
    error?: unknown;
  };
  try {
    parsed = JSON.parse(texto);
  } catch {
    return {
      ok: false,
      status: res.status,
      content: '',
      error: 'invalid_json_from_deepseek',
      detail: texto.slice(0, 600),
    };
  }

  if (parsed.error) {
    return {
      ok: false,
      status: res.status,
      content: '',
      error: 'deepseek_error_payload',
      detail: JSON.stringify(parsed.error).slice(0, 600),
    };
  }

  const choice = parsed.choices?.[0];
  const content = choice?.message?.content?.trim() ?? '';
  if (!content) {
    return {
      ok: false,
      status: res.status,
      content: '',
      error: 'empty_content',
      detail: `finish_reason=${choice?.finish_reason ?? 'unknown'}`,
    };
  }

  return { ok: true, status: res.status, content };
}

// ─────────────────────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────────────────────

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const { key: apiKey, source: keySource } = resolveApiKey();
  const models = resolveModels();

  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  // ── Diagnóstico (GET) ───────────────────────────────────────
  if (req.method === 'GET') {
    const envNames = Object.keys(env()).filter((n) => n.toUpperCase().includes('DEEPSEEK'));
    const report: Record<string, unknown> = {
      ok: Boolean(apiKey),
      service: 'generar-ejercicios',
      runtime: 'edge',
      deepseekKey: {
        present: Boolean(apiKey),
        source: keySource,
        length: apiKey?.length ?? 0,
      },
      models,
      deepseekEnvVarsVisible: envNames,
    };

    if (url.searchParams.get('ping') === '1') {
      if (!apiKey) {
        return json({ ...report, error: 'DEEPSEEK_API_KEY no está disponible en este entorno' }, 503);
      }
      const pings: Attempt[] = [];
      for (const model of models) {
        const t0 = Date.now();
        const r = await llamarDeepSeek(apiKey, model, 'ping', false);
        pings.push({
          model,
          mode: 'text',
          status: r.status,
          ok: r.ok,
          ms: Date.now() - t0,
          ...(r.error ? { error: `${r.error} ${r.detail ?? ''}`.trim() } : {}),
        });
      }
      report.ping = pings;
      report.ok = pings.some((p) => p.ok);
      log('GET ping', { pings });
    }

    return json(report, report.ok ? 200 : 503);
  }

  if (req.method !== 'POST') {
    return json({ ok: false, stage: 'request', error: 'Method Not Allowed' }, 405);
  }

  // ── Body ────────────────────────────────────────────────────
  let preguntaOriginal: string;
  let debug = false;
  try {
    const body = (await req.json()) as { pregunta?: unknown; debug?: unknown };
    preguntaOriginal = String(body.pregunta ?? '').trim();
    debug = body.debug === true;
    if (!preguntaOriginal) throw new Error('missing pregunta');
  } catch {
    return json({ ok: false, stage: 'request', error: 'pregunta es requerida' }, 400);
  }

  log('POST inicio', {
    preguntaLen: preguntaOriginal.length,
    key: keyFingerprint(apiKey),
    keySource,
    models,
  });

  // ── Config ──────────────────────────────────────────────────
  if (!apiKey) {
    log('ERROR config', { envVisible: Object.keys(env()).filter((n) => n.toUpperCase().includes('DEEPSEEK')) });
    return json(
      {
        ok: false,
        stage: 'config',
        error: 'DeepSeek no configurado en el servidor',
        detail:
          'La variable DEEPSEEK_API_KEY no está disponible en este entorno. ' +
          'Agrégala en Vercel → Settings → Environment Variables (Production) y vuelve a desplegar. ' +
          'Verifica con GET /api/generar-ejercicios.',
      },
      503,
    );
  }

  // ── Intentos: modelo × formato ──────────────────────────────
  const intentos: Attempt[] = [];
  let raw = '';
  let modelUsado = '';
  let modoUsado: 'json' | 'text' = 'json';
  let ejercicios: Ejercicio[] = [];
  const t0 = Date.now();

  const plan: { model: string; mode: 'json' | 'text' }[] = [];
  for (const model of models) {
    plan.push({ model, mode: 'json' });
    plan.push({ model, mode: 'text' });
  }

  for (const paso of plan) {
    const prompt = paso.mode === 'json' ? promptJson(preguntaOriginal) : promptTexto(preguntaOriginal);
    const inicio = Date.now();
    const r = await llamarDeepSeek(apiKey, paso.model, prompt, paso.mode === 'json');

    const intento: Attempt = {
      model: paso.model,
      mode: paso.mode,
      status: r.status,
      ok: r.ok,
      ms: Date.now() - inicio,
    };

    if (!r.ok) {
      intento.error = `${r.error ?? 'error'} ${r.detail ?? ''}`.trim().slice(0, 400);
      intentos.push(intento);
      log('intento fallido', intento);
      continue;
    }

    const parsedJson = paso.mode === 'json' ? parseEjerciciosJson(r.content) : [];
    let finales: Ejercicio[] = parsedJson;
    let modoReal: 'json' | 'text' = 'json';

    if (finales.length === 0) {
      // El modelo no respetó el formato pedido: reintenta con el parser tolerante.
      finales = parseEjerciciosTexto(r.content);
      modoReal = 'text';
    }

    if (finales.length === 0) {
      intento.error = 'no se pudo parsear ningún ejercicio';
      intentos.push(intento);
      log('intento sin ejercicios parseables', {
        ...intento,
        rawHead: r.content.slice(0, 400),
      });
      continue;
    }

    intento.ok = true;
    intentos.push(intento);
    raw = r.content;
    modelUsado = paso.model;
    modoUsado = modoReal;
    ejercicios = finales;
    break;
  }

  // ── Resultado ───────────────────────────────────────────────
  if (ejercicios.length === 0) {
    log('ERROR todos los intentos fallaron', { intentos });
    return json(
      {
        ok: false,
        stage: 'deepseek',
        error: 'No se pudieron generar ejercicios con ningún modelo/formato',
        detail: intentos
          .map((i) => `${i.model}/${i.mode} → ${i.status} ${i.error ?? ''}`.trim())
          .join(' | '),
        attempts: intentos,
      },
      502,
    );
  }

  const ms = Date.now() - t0;
  log('OK', { ejercicios: ejercicios.length, model: modelUsado, mode: modoUsado, ms });

  return json({
    ok: true,
    ejercicios,
    raw,
    model: modelUsado,
    mode: modoUsado,
    ms,
    ...(debug ? { attempts: intentos } : {}),
  });
}
