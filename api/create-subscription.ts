// Removed unused @vercel/node import causing build failures on Edge runtime


export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { planId, userId, userEmail } = await req.json();
    const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

    if (!MP_ACCESS_TOKEN) {
      return new Response(JSON.stringify({ error: 'Mercado Pago Access Token no configurado en Vercel' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const plans: Record<string, { title: string, price: number }> = {
      mensual: { title: 'Suscripción Mensual - CyberEdu MX', price: 50 },
      trimestral: { title: 'Suscripción 3 Meses - CyberEdu MX', price: 120 },
      anual: { title: 'Suscripción Anual - CyberEdu MX', price: 399 },
    };

    const plan = plans[planId];
    if (!plan) {
      return new Response(JSON.stringify({ error: 'Plan inválido' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // El host dinámico para las URLs de retorno y el webhook
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const APP_URL = process.env.APP_URL || 'https://cyberedu-mx.vercel.app';
    const host = req.headers.get('host') || new URL(APP_URL).host;
    const baseUrl = `${protocol}://${host}`;

    const preferenceBody = {
      items: [
        {
          id: planId,
          title: plan.title,
          unit_price: plan.price,
          quantity: 1,
          currency_id: 'MXN',
          description: `Acceso Premium ${planId} a CyberEdu MX`,
        }
      ],
      payer: {
        email: userEmail,
      },
      external_reference: userId,
      // Mercado Pago notificará a este endpoint cuando el pago cambie de estado
      notification_url: `${baseUrl}/api/webhook-mercadopago`,
      back_urls: {
        success: `${baseUrl}/area/habilidades?payment=success`,
        failure: `${baseUrl}/subscription?payment=failure`,
        pending: `${baseUrl}/subscription?payment=pending`,
      },
      auto_return: 'approved',
      binary_mode: true, // No permite pagos pendientes (ej. OXXO) para activación inmediata
      metadata: {
        user_id: userId,
        plan_id: planId,
      }
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferenceBody),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear preferencia en Mercado Pago');
    }

    return new Response(JSON.stringify({ 
      id: data.id, 
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point 
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });

  } catch (error: any) {
    console.error('Error create-subscription:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
