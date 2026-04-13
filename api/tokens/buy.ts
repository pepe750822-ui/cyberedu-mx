export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  if (!MP_ACCESS_TOKEN) {
    return new Response(JSON.stringify({ error: 'Configuración de Mercado Pago faltante' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { packageId, userId, userEmail } = await req.json();

    if (!packageId || !userId) {
      return new Response(JSON.stringify({ error: 'Faltan parámetros: packageId o userId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Definir paquetes
    const packages: Record<string, { name: string; price: number; tokens: number }> = {
      'basico':    { name: 'Paquete Lanzamiento (20 tokens)',    price: 20,  tokens: 20   },
      'popular':   { name: 'Paquete Estudiante (60 tokens)',     price: 50,  tokens: 60   },
      'pro':       { name: 'Paquete Pro (160 tokens)',            price: 120, tokens: 160  },
      'ilimitado': { name: 'Suscripción Maestro (1000 tokens)',   price: 250, tokens: 1000 },
    };

    const pkg = packages[packageId];
    if (!pkg) {
      return new Response(JSON.stringify({ error: 'Paquete no válido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Detectar si estamos en sandbox o producción según el token
    const isSandbox = MP_ACCESS_TOKEN.startsWith('TEST-');
    console.log(`[MP] Modo: ${isSandbox ? 'SANDBOX (TEST-)' : 'PRODUCCIÓN (APP_USR-)'}`);

    const APP_URL = process.env.APP_URL || 'https://cyberedu-mx.vercel.app';

    const preference = {
      items: [
        {
          id: packageId,
          title: pkg.name,
          unit_price: pkg.price,
          quantity: 1,
          currency_id: 'MXN',
        },
      ],
      payer: {
        // En producción usar email real; en sandbox acepta cualquiera
        email: userEmail || (isSandbox ? 'test_user_123@testuser.com' : 'pagador@cyberedumx.com'),
      },
      external_reference: userId,
      metadata: {
        type: 'token_purchase',
        userId: userId,
        packageId: packageId,
        tokenAmount: pkg.tokens,
      },
      back_urls: {
        success: `${APP_URL}/tokens?status=success`,
        failure: `${APP_URL}/tokens?status=failure`,
        pending: `${APP_URL}/tokens?status=pending`,
      },
      auto_return: 'approved',
      notification_url: `${APP_URL}/api/webhook-mercadopago`,
      // ✅ Forzar 1 cuota — sin esto MP intenta calcular MSI y bloquea el botón "Pagar"
      payment_methods: {
        excluded_payment_types: [],
        installments: 1,
      },
      // ✅ Modo binario: aprobado o rechazado de inmediato, sin estados "en proceso"
      binary_mode: true,
    };

    const mpResp = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    });

    if (!mpResp.ok) {
      const err = await mpResp.text();
      throw new Error(`Error en Mercado Pago: ${err}`);
    }

    const data = await mpResp.json();

    // ✅ Sandbox → sandbox_init_point | Producción → init_point
    const checkoutUrl = isSandbox
      ? (data.sandbox_init_point || data.init_point)
      : data.init_point;

    console.log(`[MP] Preferencia creada: ${data.id} | Modo: ${isSandbox ? 'sandbox' : 'producción'} | URL: ${checkoutUrl}`);

    return new Response(JSON.stringify({ id: data.id, init_point: checkoutUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('[MP] Error al crear preferencia:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
