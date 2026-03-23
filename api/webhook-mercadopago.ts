import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const query = new URL(req.url).searchParams;
    
    // Mercado Pago envía el ID de la operación por query params o body dependiendo del tipo de evento
    const type = body.type || query.get('type');
    const paymentId = body.data?.id || query.get('data.id') || query.get('id');

    // Solo nos interesan eventos de tipo 'payment'
    if (type === 'payment' && paymentId) {
      const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
      const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
      const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!MP_ACCESS_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        console.error('Configuración faltante en el servidor (MP/Supabase tokens).');
        return new Response('Server configuration error', { status: 500 });
      }

      // 1. Consultar el estado real del pago en la API de Mercado Pago (Seguridad)
      const mpResp = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        },
      });

      if (!mpResp.ok) throw new Error(`Error al consultar Mercado Pago: ${mpResp.status}`);
      
      const paymentData = await mpResp.json();
      const { status, external_reference, metadata } = paymentData;

      // 2. Si el pago está aprobado, activamos el rol subscriber
      if (status === 'approved' && external_reference) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        // Actualizar el perfil del usuario (usando Service Role para saltar el RLS)
        const { error } = await supabase
          .from('profiles')
          .update({ 
            subscription_status: 'active',
            // Opcional: registrar el plan si viene en metadata
          })
          .eq('id', external_reference);

        if (error) {
          console.error(`Error de base de datos para usuario ${external_reference}:`, error);
          throw error;
        }

        console.log(`SUSCRIPCIÓN ACTIVADA: Usuario ${external_reference} con pago ID ${paymentId}`);
      } else {
        console.log(`Estado del pago ${paymentId}: ${status}`);
      }
    }

    // Siempre responder 200 OK a Mercado Pago rápidamente para evitar reintentos si procesamos bien el evento
    return new Response('Webhook received and processed', { status: 200 });

  } catch (error: any) {
    console.error('FALLO EN WEBHOOK:', error.message);
    // Respondemos con 200 aunque falle internamente para evitar que Mercado Pago siga bombardeando el endpoint.
    // Los logs de Vercel nos servirán para debugear.
    return new Response('Webhook processed with internal errors', { status: 200 });
  }
}
