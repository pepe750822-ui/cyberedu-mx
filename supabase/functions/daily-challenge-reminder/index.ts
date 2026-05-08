import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from "https://esm.sh/web-push@3.6.6"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apiKey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // VAPID Configuration
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error("Missing VAPID keys in environment variables");
      return new Response(JSON.stringify({ error: "VAPID keys not configured" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    webpush.setVapidDetails(
      'mailto:pepe750822@gmail.com',
      vapidPublicKey,
      vapidPrivateKey
    )

    // 1. Get all subscriptions
    const { data: subscriptions, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (fetchError) throw fetchError;

    // 2. Define notification content
    const payload = JSON.stringify({
      title: '🎯 ¡Reto Diario Disponible!',
      body: 'Tu desafío de hoy te espera. ¡Resuelve y gana tokens gratis! ⚡',
      icon: 'https://cyberedumx.com/icons/icon-192x192.png',
      badge: 'https://cyberedumx.com/icons/icon-72x72.png',
      url: '/',
      tag: 'daily-challenge-reminder'
    });

    // 3. Send notifications in parallel
    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(sub.subscription, payload);
        return { user_id: sub.user_id, success: true };
      } catch (err) {
        console.error(`Error sending to user ${sub.user_id}:`, err);
        // Clean up expired subscriptions (410 Gone or 404 Not Found)
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from('push_subscriptions').delete().eq('id', sub.id);
        }
        return { user_id: sub.user_id, success: false, error: err.message };
      }
    });

    const results = await Promise.all(sendPromises);

    return new Response(JSON.stringify({
      message: `Enviadas ${results.filter(r => r.success).length} notificaciones de ${subscriptions.length}`,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})
