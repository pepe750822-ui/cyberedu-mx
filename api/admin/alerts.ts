export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: Request) {
// @ts-ignore
  const UPSTASH_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
// @ts-ignore
  const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
// @ts-ignore
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
// @ts-ignore
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
// @ts-ignore
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 1. Handle Test Alert (POST)
  if (req.method === 'POST') {
    const { test } = await req.json().catch(() => ({}));
    if (test && RESEND_API_KEY) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'CyberEdu Alerts <alerts@cyberedumx.com>',
            to: ['pepe750822@gmail.com'],
            subject: `📧 PRUEBA DE ALERTA - CyberEdu MX`,
            html: `<p>Esta es una prueba manual del sistema de alertas de costo.</p>
                   <p>Si recibes esto, el sistema de notificaciones está operando correctamente.</p>`
          })
        });

        if (emailRes.ok) {
          return new Response(JSON.stringify({ status: 'ok', msg: 'Email enviado a pepe750822@gmail.com' }), { headers: corsHeaders });
        } else {
          const err = await emailRes.json();
          return new Response(JSON.stringify({ status: 'error', msg: err.message || 'Error en Resend' }), { status: 500, headers: corsHeaders });
        }
      } catch (e: any) {
        return new Response(JSON.stringify({ status: 'error', msg: e.message }), { status: 500, headers: corsHeaders });
      }
    }
    return new Response(JSON.stringify({ status: 'error', msg: 'Falta RESEND_API_KEY o parámetro test' }), { status: 400, headers: corsHeaders });
  }

  const today = new Date().toISOString().split('T')[0];
  const dayCostKey = `daily_cost:${today}`;
  const alertSentKey = `alert_sent:${today}`;

  let currentCost = 0;
  let alertSent = false;

  // 1. Fetch current daily cost
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const costRes = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(dayCostKey)}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      if (costRes.ok) {
        const data = await costRes.json();
        currentCost = parseFloat(data.result || "0");
      }

      const sentRes = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(alertSentKey)}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      if (sentRes.ok) {
        const data = await sentRes.json();
        alertSent = data.result === "true";
      }
    } catch (e) {
      console.error('Error fetching cost from Redis:', e);
    }
  }

  const threshold = 5.0; // $5 USD
  const warningThreshold = threshold * 0.8; // $4 USD

  let info = {
    current_cost: currentCost,
    limit: threshold,
    is_above_limit: currentCost >= threshold,
    is_approaching: currentCost >= warningThreshold,
    alert_sent: alertSent,
    today
  };

  // 2. Check if we need to send an alert
  if (currentCost >= threshold && !alertSent) {
    let emailSent = false;
    
    // A. Send email using Resend
    if (RESEND_API_KEY) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'CyberEdu Alerts <alerts@cyberedumx.com>',
            to: ['pepe750822@gmail.com'],
            subject: `⚠️ ALERTA DE COSTO: Límite excedido (${today})`,
            html: `<p>El costo diario de CyberEdu MX ha superado el límite de $${threshold} USD.</p>
                   <p>Costo actual: <strong>$${currentCost.toFixed(2)} USD</strong></p>
                   <p>Por favor revise el panel de administración y el uso de la API.</p>`
          })
        });
        if (emailRes.ok) emailSent = true;
      } catch (e) {
        console.error('Error sending email alert:', e);
      }
    }

    // B. Persist alert in Supabase (Record keeping / Fallback)
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/cost_alerts`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            date: today,
            cost: currentCost,
            threshold: threshold,
            email_sent: emailSent,
            created_at: new Date().toISOString()
          })
        });
      } catch (e) {
        console.error('Error recording alert in Supabase:', e);
      }
    }

    if (emailSent && UPSTASH_URL && UPSTASH_TOKEN) {
      // Mark alert as sent for today in Redis to avoid spamming
      await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(alertSentKey)}/true/EX/86400`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      info.alert_sent = true;
    }
  }

  return new Response(JSON.stringify({
    status: 'ok',
    ...info
  }), {
    status: 200,
    headers: corsHeaders
  });
}
