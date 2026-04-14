export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: Request) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 1. Verificar que existe la key
  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({
      status: 'error',
      message: 'ANTHROPIC_API_KEY no configurada en las variables de entorno de Vercel.',
      hasKey: false,
      keyPrefix: null,
      lastChecked: new Date().toISOString(),
    }), { status: 200, headers: corsHeaders });
  }

  const keyPrefix = ANTHROPIC_API_KEY.substring(0, 12) + '...' + ANTHROPIC_API_KEY.slice(-4);

  // 2. Verificar que la key es válida llamando a /v1/models (endpoint ligero)
  try {
    const modelsRes = await fetch('https://api.anthropic.com/v1/models', {
      method: 'GET',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
    });

    // Leer rate limit headers si los hay
    const rateLimitRequests = modelsRes.headers.get('anthropic-ratelimit-requests-remaining');
    const rateLimitTokens = modelsRes.headers.get('anthropic-ratelimit-tokens-remaining');
    const rateLimitReset = modelsRes.headers.get('anthropic-ratelimit-requests-reset');

    if (!modelsRes.ok) {
      const errBody = await modelsRes.json().catch(() => ({}));
      const errType = (errBody as any)?.error?.type || 'unknown';

      let status = 'error';
      let message = `Error de API (${modelsRes.status})`;

      if (modelsRes.status === 401) {
        message = '❌ API Key inválida o revocada. Genera una nueva en console.anthropic.com';
      } else if (modelsRes.status === 429) {
        status = 'warning';
        message = '⚠️ Límite de requests alcanzado (rate limit). Espera unos minutos.';
      } else if (modelsRes.status === 529) {
        status = 'warning';
        message = '⚠️ API de Anthropic sobrecargada temporalmente. Intenta de nuevo.';
      } else if (errType === 'insufficient_quota') {
        message = '💸 Saldo agotado. Recarga créditos en console.anthropic.com/settings/billing';
      }

      return new Response(JSON.stringify({
        status,
        message,
        hasKey: true,
        keyPrefix,
        lastChecked: new Date().toISOString(),
        anthropicStatus: {
          httpStatus: modelsRes.status,
          rateLimitRemaining: rateLimitRequests ? parseInt(rateLimitRequests) : null,
          rateLimitReset,
        },
      }), { status: 200, headers: corsHeaders });
    }

    const modelsData = await modelsRes.json();
    const availableModels = (modelsData as any)?.data?.map((m: any) => m.id) ?? [];
    const haiku4Available = availableModels.some((m: string) => m.includes('haiku-4'));

    return new Response(JSON.stringify({
      status: 'ok',
      message: '✅ API Key activa y funcionando correctamente.',
      hasKey: true,
      keyPrefix,
      lastChecked: new Date().toISOString(),
      model: 'claude-haiku-4-5',
      modelAvailable: haiku4Available,
      anthropicStatus: {
        rateLimitRemaining: rateLimitRequests ? parseInt(rateLimitRequests) : null,
        rateLimitTokensRemaining: rateLimitTokens ? parseInt(rateLimitTokens) : null,
        rateLimitReset: rateLimitReset ?? null,
        availableModels,
      },
    }), { status: 200, headers: corsHeaders });

  } catch (err: any) {
    return new Response(JSON.stringify({
      status: 'error',
      message: `Error de red al contactar la API de Anthropic: ${err.message}`,
      hasKey: true,
      keyPrefix,
      lastChecked: new Date().toISOString(),
    }), { status: 200, headers: corsHeaders });
  }
}
