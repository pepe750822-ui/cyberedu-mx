export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  // @ts-ignore
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  // @ts-ignore
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  // @ts-ignore
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // @ts-ignore
  const APP_URL = process.env.APP_URL || 'https://cyberedu-mx.vercel.app';

  const allowedOrigins = [
    'https://cyberedumx.com',
    'https://www.cyberedumx.com',
    APP_URL,
    'http://localhost:5173',
    'http://localhost:3000',
  ];
  const origin = req.headers.get('origin');
  const corsOrigin = !origin
    ? 'https://cyberedumx.com'
    : allowedOrigins.includes(origin) ? origin : 'https://cyberedumx.com';

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let subindice: string;
  try {
    const body = await req.json();
    subindice = (body.subindice || '').trim();
  } catch {
    return new Response(JSON.stringify({ error: 'Cuerpo inválido' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!subindice) {
    return new Response(JSON.stringify({ error: 'Falta el campo subindice' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Supabase REST helper
  const sbReq = async (path: string, opts: RequestInit = {}) => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      ...opts,
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
        ...(opts.headers as Record<string, string> || {}),
      },
    });
    const text = await res.text().catch(() => '');
    if (!res.ok) return { data: null, error: text };
    if (!text) return { data: null, error: null };
    try { return { data: JSON.parse(text) as any, error: null }; } catch { return { data: text, error: null }; }
  };

  // Validate JWT via Supabase auth endpoint
  let userId: string;
  try {
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!userRes.ok) throw new Error('Token inválido');
    const userData = await userRes.json() as { id: string };
    userId = userData.id;
  } catch {
    return new Response(JSON.stringify({ error: 'Sesión inválida o expirada' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Load profile
  const { data: profiles } = await sbReq(
    `profiles?id=eq.${userId}&select=tokens,paquete_completo,subscription_status,is_premium`
  );
  const profile = Array.isArray(profiles) ? profiles[0] : null;

  if (!profile) {
    return new Response(JSON.stringify({ error: 'Perfil no encontrado' }), {
      status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const isFree =
    profile.paquete_completo === true ||
    profile.subscription_status === 'active' ||
    profile.is_premium === true;
  const currentTokens = Number(profile.tokens ?? 0);
  const TOKEN_COST = 10;

  if (!isFree && currentTokens < TOKEN_COST) {
    return new Response(
      JSON.stringify({
        error: `Necesitas ${TOKEN_COST} tokens para practicar este subíndice. Tienes ${currentTokens}.`,
        code: 'insufficient_tokens',
        currentTokens,
        required: TOKEN_COST,
      }),
      { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Normalize subindice ID for cache lookup
  const subindiceId = subindice
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  // Try cache
  let questions: unknown[] | null = null;
  try {
    const { data: cached } = await sbReq(
      `subindice_questions?subindice_id=eq.${subindiceId}&select=questions_json,created_at`
    );
    if (Array.isArray(cached) && cached.length > 0) {
      const ageMs = Date.now() - new Date(cached[0].created_at).getTime();
      const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
      if (ageMs < THIRTY_DAYS_MS) {
        questions = cached[0].questions_json;
      }
    }
  } catch {
    // Table may not exist yet — continue without cache
  }

  if (!questions) {
    if (!DEEPSEEK_API_KEY) {
      return new Response(JSON.stringify({ error: 'Servicio de generación no configurado' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt =
      `Eres un experto en el examen ECOEMS de México. ` +
      `Genera exactamente 5 preguntas de opción múltiple sobre el tema: ${subindice}. ` +
      `Cada pregunta debe:\n` +
      `- Tener 4 opciones (A, B, C, D)\n` +
      `- Tener una sola respuesta correcta\n` +
      `- Ser del nivel de dificultad del ECOEMS real\n` +
      `- Incluir una explicación breve de por qué es correcta\n` +
      `Responde SOLO en JSON con este formato exacto:\n` +
      `{"questions": [{"question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 0, "explanation": "..."}]}\n\n` +
      `Importante: "correct" es el índice 0-based (0=A, 1=B, 2=C, 3=D) de la opción correcta.`;

    try {
      const dsRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2048,
          temperature: 0.7,
          response_format: { type: 'json_object' },
        }),
      });

      if (!dsRes.ok) {
        const errText = await dsRes.text().catch(() => '');
        throw new Error(`DeepSeek ${dsRes.status}: ${errText.slice(0, 200)}`);
      }

      const dsData = await dsRes.json() as { choices: { message: { content: string } }[] };
      const content = dsData.choices?.[0]?.message?.content;
      if (!content) throw new Error('DeepSeek no retornó contenido');

      let parsed: { questions: unknown[] };
      try {
        parsed = JSON.parse(content);
      } catch {
        // Try to extract JSON block from markdown fences
        const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (!match) throw new Error('No se pudo parsear la respuesta de DeepSeek');
        parsed = JSON.parse(match[1]);
      }

      if (!Array.isArray(parsed.questions)) throw new Error('Formato de respuesta inválido');
      questions = parsed.questions.slice(0, 5);

      // Persist to cache (fire and forget — ignore errors if table doesn't exist)
      sbReq(`subindice_questions?on_conflict=subindice_id`, {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify({
          subindice_id: subindiceId,
          questions_json: questions,
          updated_at: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[practica-subindice] DeepSeek error:', msg);
      return new Response(JSON.stringify({ error: 'Error generando preguntas: ' + msg }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // Deduct tokens (server-authoritative)
  if (!isFree) {
    await sbReq(`profiles?id=eq.${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        tokens: Math.max(0, currentTokens - TOKEN_COST),
        updated_at: new Date().toISOString(),
      }),
    });
  }

  return new Response(
    JSON.stringify({ questions, tokensDeducted: isFree ? 0 : TOKEN_COST }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
