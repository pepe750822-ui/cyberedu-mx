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
      'basico': { name: 'Paquete Básico (10 tokens)', price: 25, tokens: 10 },
      'popular': { name: 'Paquete Popular (30 tokens)', price: 60, tokens: 30 },
      'pro': { name: 'Paquete Pro (100 tokens)', price: 150, tokens: 100 },
      'ilimitado': { name: 'Paquete Ilimitado (1000 tokens/mes)', price: 200, tokens: 1000 },
    };

    const pkg = packages[packageId];
    if (!pkg) {
      return new Response(JSON.stringify({ error: 'Paquete no válido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const preference = {
      items: [
        {
          id: packageId,
          title: pkg.name,
          unit_price: pkg.price,
          quantity: 1,
          currency_id: 'MXN',
        }
      ],
      payer: {
        email: userEmail || 'test_user_123@testuser.com',
      },
      external_reference: userId,
      metadata: {
        type: 'token_purchase',
        userId: userId,
        packageId: packageId,
        tokenAmount: pkg.tokens
      },
      back_urls: {
        success: `${process.env.APP_URL || 'https://cyberedu-mx.vercel.app'}/tokens?status=success`,
        failure: `${process.env.APP_URL || 'https://cyberedu-mx.vercel.app'}/tokens?status=failure`,
        pending: `${process.env.APP_URL || 'https://cyberedu-mx.vercel.app'}/tokens?status=pending`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.APP_URL || 'https://cyberedu-mx.vercel.app'}/api/webhook-mercadopago`,
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
    return new Response(JSON.stringify({ id: data.id, init_point: data.init_point }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
