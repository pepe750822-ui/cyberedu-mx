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
  /** Desarrollo paso a paso hasta el resultado correcto. Cadena vacía si el modelo no lo dio. */
  desarrollo: string;
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

/**
 * Materia tal como debe aparecer en el prompt.
 *
 * En la tabla `materia` guarda solo "Matemáticas IV", pero el modelo rinde
 * mejor sabiendo el nivel (ENP UNAM, preparatoria). Se añade el contexto
 * únicamente si la materia no lo trae ya, para no repetirlo.
 */
function materiaParaPrompt(materia: string): string {
  const limpia = materia.trim().replace(/\s+/g, ' ');
  if (!limpia) return 'Matemáticas IV ENP UNAM';
  return /enp|unam|preparatoria|bachillerato/i.test(limpia) ? limpia : `${limpia} ENP UNAM`;
}

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
/** Encabezado que abre el bloque de desarrollo paso a paso. */
const DESARROLLO_RE = /^\s*(?:desarrollo|procedimiento|soluci[oó]n|resoluci[oó]n|paso\s+a\s+paso)\s*:?\s*$/i;
/** Encabezado explícito de un ejercicio nuevo, p. ej. "Ejercicio 2: ...". */
const NUEVO_EJERCICIO_RE = /^\s*(?:ejercicio|problema|pregunta)\s*\d+\s*[.:)-]?\s*(.*)$/i;
/** Marcador de opción dentro de una línea, p. ej. "A) ", "(B) ", "C. ". */
const MARCADOR_OPCION_RE = /(?:\(([A-Da-d])\)|([A-Da-d])[.):-])\s*/g;

/**
 * Algunos modelos escriben las cuatro opciones en una sola línea
 * ("A) 4  B) 5  C) 6  D) 7"). Solo se separa cuando aparecen las letras
 * a, b, c, d (o un prefijo ascendente de ellas) en orden, para no partir
 * texto normal que mencione una letra suelta.
 */
function expandirOpcionesEnLinea(linea: string): string[] | null {
  const matches = [...linea.matchAll(MARCADOR_OPCION_RE)];
  if (matches.length < 3) return null;

  const letras = matches.map((m) => (m[1] ?? m[2]).toLowerCase());
  const esperadas = ['a', 'b', 'c', 'd'].slice(0, letras.length);
  if (letras.join('') !== esperadas.join('')) return null;

  const resultado: string[] = [];
  const prefijo = linea.slice(0, matches[0].index ?? 0).trim();
  if (prefijo) resultado.push(prefijo);

  matches.forEach((m, i) => {
    const inicio = (m.index ?? 0) + m[0].length;
    const fin = i + 1 < matches.length ? matches[i + 1].index ?? linea.length : linea.length;
    resultado.push(`${(m[1] ?? m[2]).toUpperCase()}) ${linea.slice(inicio, fin).trim()}`);
  });
  return resultado;
}

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
  desarrollo: string[] = [],
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
    desarrollo: desarrollo.join('\n').trim(),
  };
}

/**
 * Parser tolerante: acepta "1." / "1)" / "(A)" / "A." / "A)" / "A:" / viñetas,
 * opciones en una sola línea, bloque "Desarrollo:" y "Respuesta correcta: x"
 * en cualquiera de sus variantes.
 */
function parseEjerciciosTexto(texto: string): Ejercicio[] {
  const contenido = normalizar(texto);
  if (!contenido) return [];

  const ejercicios: Ejercicio[] = [];
  let pregunta: string[] = [];
  let opciones = new Map<string, string>();
  let respuesta: string | null = null;
  let desarrollo: string[] = [];
  let enDesarrollo = false;
  let bullets = 0;
  const letrasBullet = ['a', 'b', 'c', 'd'];

  const flush = () => {
    const ej = toEjercicio(pregunta.join(' '), opciones, respuesta, desarrollo);
    if (ej) ejercicios.push(ej);
    pregunta = [];
    opciones = new Map<string, string>();
    respuesta = null;
    desarrollo = [];
    enDesarrollo = false;
    bullets = 0;
  };

  // Separa las opciones que vengan todas en la misma línea
  const lineas: string[] = [];
  for (const linea of contenido.split('\n')) {
    const expandidas = expandirOpcionesEnLinea(linea);
    if (expandidas) lineas.push(...expandidas);
    else lineas.push(linea);
  }

  for (const linea of lineas) {
    const trimmed = linea.trim();
    if (!trimmed) continue;

    // 1) Encabezado explícito "Ejercicio N: ..." → cierra el anterior
    const nuevo = trimmed.match(NUEVO_EJERCICIO_RE);
    if (nuevo) {
      flush();
      pregunta = nuevo[1] ? [nuevo[1]] : [];
      continue;
    }

    // 2) Nueva pregunta numerada → cierra la anterior
    const numerada = trimmed.match(NUMBER_LINE_RE);
    if (numerada) {
      flush();
      pregunta = [numerada[2]];
      continue;
    }

    // 3) Línea de respuesta correcta (va al final, después del desarrollo)
    if (ANSWER_LINE_RE.test(trimmed)) {
      const m = trimmed.match(ANSWER_LINE_RE);
      if (m) respuesta = m[1].toLowerCase();
      enDesarrollo = false;
      continue;
    }

    // 4) Encabezado "Desarrollo:" → todo lo que sigue son pasos, no pregunta
    if (DESARROLLO_RE.test(trimmed)) {
      enDesarrollo = true;
      continue;
    }

    // 5) Dentro del desarrollo, ninguna línea se interpreta como opción ni pregunta
    if (enDesarrollo) {
      desarrollo.push(trimmed);
      continue;
    }

    // 6) Opción con letra
    const opcion = matchOpcion(trimmed);
    if (opcion) {
      // Una nueva "A" después de haber cerrado las opciones anteriores → nuevo ejercicio
      if (opcion.letra === 'a' && opciones.has('a')) flush();
      opciones.set(opcion.letra, opcion.texto);
      continue;
    }

    // 7) Viñeta sin letra → se numera como opción mientras no haya letras
    const bullet = trimmed.match(BULLET_RE);
    if (bullet && opciones.size < 4 && !opciones.has('a')) {
      opciones.set(letrasBullet[bullets] ?? 'a', bullet[1].trim());
      bullets += 1;
      continue;
    }

    // 8) Texto libre: continúa la pregunta, o abre una nueva si ya había opciones
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

  // Desarrollo paso a paso (puede venir como string con \n o como arreglo de pasos)
  const crudo =
    item.desarrollo ??
    item.explanation ??
    item.solucion ??
    item.solución ??
    item.solution ??
    item.procedimiento ??
    item.steps;
  let desarrollo = '';
  if (Array.isArray(crudo)) {
    desarrollo = crudo.map((p) => String(p ?? '').trim()).filter(Boolean).join('\n');
  } else if (typeof crudo === 'string') {
    desarrollo = crudo.trim();
  }

  return toEjercicio(pregunta, opciones, respuesta, desarrollo ? desarrollo.split('\n') : []);
}

// ─────────────────────────────────────────────────────────────
// Prompts
// ─────────────────────────────────────────────────────────────

function promptJson(preguntaOriginal: string, materia: string): string {
  return (
    `Eres profesor de ${materia}.\n` +
    `Genera exactamente 2 ejercicios de opción múltiple, similares al ejercicio de referencia, ` +
    `para que el estudiante practique el mismo concepto.\n\n` +
    `Ejercicio de referencia:\n"""${preguntaOriginal}"""\n\n` +
    `Reglas:\n` +
    `- Cada ejercicio debe tener exactamente 4 opciones.\n` +
    `- La respuesta correcta NUNCA debe aparecer ni insinuarse dentro del texto de la pregunta ni de las opciones.\n` +
    `- En "desarrollo" muestra SOLO el desarrollo paso a paso para llegar al resultado correcto.\n` +
    `- Sin mencionar opciones incorrectas.\n` +
    `- Máximo 5 líneas en "desarrollo", separadas por \\n y terminando en el resultado.\n` +
    `- Sin notación LaTeX ni símbolos matemáticos especiales. Usa solo texto plano: ×, ÷, =, ^\n` +
    `- Los ejercicios deben ser distintos entre sí.\n\n` +
    `Responde SOLO con JSON válido, sin markdown ni texto adicional, con este formato exacto:\n` +
    `{"ejercicios":[{"pregunta":"texto de la pregunta","opciones":["texto opción A","texto opción B","texto opción C","texto opción D"],"desarrollo":"paso 1\\npaso 2\\nresultado","correcta":0}]}\n` +
    `"correcta" es el índice 0-based de la opción correcta (0=A, 1=B, 2=C, 3=D).`
  );
}

function promptTexto(preguntaOriginal: string, materia: string): string {
  return (
    `Eres profesor de ${materia}.\n` +
    `Para cada ejercicio muestra SOLO el desarrollo paso a paso para llegar al resultado correcto.\n` +
    `Sin mencionar opciones incorrectas.\n` +
    `Máximo 5 líneas por ejercicio.\n` +
    `Sin notación LaTeX ni símbolos matemáticos especiales. Usa solo texto plano: ×, ÷, =, ^\n\n` +
    `Genera exactamente 2 ejercicios similares al siguiente, para que el estudiante practique el mismo concepto:\n` +
    `"""${preguntaOriginal}"""\n\n` +
    `Formato EXACTO de cada ejercicio:\n` +
    `Ejercicio 1: [pregunta]\n` +
    `A) ... B) ... C) ... D) ...\n` +
    `Desarrollo:\n` +
    `[paso 1]\n` +
    `[paso 2]\n` +
    `[resultado]\n` +
    `Respuesta correcta: [letra]\n\n` +
    `Ejercicio 2: [pregunta]\n` +
    `A) ... B) ... C) ... D) ...\n` +
    `Desarrollo:\n` +
    `[paso 1]\n` +
    `[paso 2]\n` +
    `[resultado]\n` +
    `Respuesta correcta: [letra]\n\n` +
    `No incluyas texto adicional ni bloques de Markdown fuera de los ejercicios. ` +
    `La línea "Respuesta correcta" va SIEMPRE al final de cada ejercicio, en su propia línea, ` +
    `y nunca debe mencionarse ni insinuarse dentro de la pregunta, de las opciones o del desarrollo.`
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
  let materia: string;
  let debug = false;
  try {
    const body = (await req.json()) as { pregunta?: unknown; materia?: unknown; debug?: unknown };
    preguntaOriginal = String(body.pregunta ?? '').trim();
    materia = String(body.materia ?? '').trim();
    debug = body.debug === true;
    if (!preguntaOriginal) throw new Error('missing pregunta');
  } catch {
    return json({ ok: false, stage: 'request', error: 'pregunta es requerida' }, 400);
  }

  // Materia real de la pregunta (Matemáticas IV, Física IV, …) con su nivel.
  // Si el cliente no la manda se conserva el comportamiento anterior.
  const materiaPrompt = materiaParaPrompt(materia);

  log('POST inicio', {
    preguntaLen: preguntaOriginal.length,
    materia: materiaPrompt,
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
    const prompt = paso.mode === 'json'
      ? promptJson(preguntaOriginal, materiaPrompt)
      : promptTexto(preguntaOriginal, materiaPrompt);
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
