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
        
        // Determinar qué estamos activando basándonos en metadata
        const isTokenPurchase = metadata?.type === 'token_purchase';
        const tokenAmount = metadata?.token_amount || metadata?.tokenAmount || 0;

        if (isTokenPurchase && tokenAmount > 0) {
            // 1. Intentar obtener balance por ID (external_reference) o por Email (como respaldo)
            let { data: profile } = await supabase.from('profiles').select('id, tokens, subscription_status').eq('id', external_reference).single();
            
            // Si no lo encuentra por ID, intentar por el email que viene en el pago de MP
            if (!profile && paymentData.payer?.email) {
              console.log(`Buscando por email de respaldo: ${paymentData.payer.email}`);
              const { data: profileByEmail } = await supabase.from('profiles').select('id, tokens, subscription_status').eq('email', paymentData.payer.email).single();
              profile = profileByEmail;
            }

            if (profile) {
              const currentTokens = profile.tokens || 0;
              const newTokens = currentTokens + Number(tokenAmount);
              
              // Map package ID to human readable names
              const packageNames: Record<string, string> = {
                'basico': 'Paquete Básico (20 tokens)',
                'popular': 'Paquete Popular (60 tokens)',
                'pro': 'Paquete Pro (160 tokens)',
                'ilimitado': 'Plan Maestro Ilimitado'
              };
              const currentPkgName = metadata?.packageId ? packageNames[metadata.packageId] : null;

              const { error } = await supabase
                .from('profiles')
                .update({ 
                    tokens: newTokens,
                    updated_at: new Date().toISOString(),
                    subscription_status: metadata?.packageId === 'ilimitado' ? 'active' : profile.subscription_status
                })
                .eq('id', profile.id);

              if (error) throw error;
              console.log(`TOKENS AGREGADOS: ${tokenAmount} tokens al usuario ${profile.id} (${paymentData.payer?.email})`);
            } else {
              console.error(`PAGO RECIBIDO PERO USUARIO NO ENCONTRADO. ID: ${external_reference}, Email: ${paymentData.payer?.email}`);
            }
        } else if (metadata?.type === 'subscription' || metadata?.packageId === 'ilimitado') {
          // Lógica de suscripción (Maestro o Ilimitado)
          const { error } = await supabase
            .from('profiles')
            .update({ 
              subscription_status: 'active',
              is_premium: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', external_reference);

          if (error) throw error;
          console.log(`SUSCRIPCIÓN ACTIVADA: Usuario ${external_reference}`);
        } else {
          console.warn(`PAGO RECIBIDO PERO TIPO DESCONOCIDO. Metadata:`, metadata);
        }
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
