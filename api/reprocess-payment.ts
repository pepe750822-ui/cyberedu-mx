import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

const PACKAGES: Record<string, { tokens?: number; flags?: Record<string, boolean> }> = {
  basico:           { tokens: 20 },
  popular:          { tokens: 60 },
  pro:              { tokens: 160 },
  ilimitado:        { tokens: 1000 },
  guia2026:         { flags: { bank10_unlocked: true, guia2026_unlocked: true } },
  paquete_completo: { flags: { bank5_unlocked: true, bank8_unlocked: true, bank9_unlocked: true, bank10_unlocked: true, guia2026_unlocked: true, paquete_completo: true } },
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'cyberedu-admin-2026';
  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!MP_ACCESS_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return new Response(JSON.stringify({ error: 'Configuración de servidor incompleta' }), { status: 500 });
  }

  try {
    const { secret, paymentId } = await req.json();

    if (secret !== ADMIN_SECRET) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }
    if (!paymentId) {
      return new Response(JSON.stringify({ error: 'Falta paymentId' }), { status: 400 });
    }

    // 1. Consultar el pago en Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` },
    });
    const payment = await mpRes.json();

    if (payment.status !== 'approved') {
      return new Response(JSON.stringify({ error: `Pago no aprobado: ${payment.status}` }), { status: 400 });
    }

    // 2. Obtener metadata — con fallback a la preferencia si está vacía
    let metadata = payment.metadata || {};
    let externalRef = payment.external_reference;

    if ((!metadata.package_id && !metadata.packageId) && payment.preference_id) {
      const prefRes = await fetch(
        `https://api.mercadopago.com/checkout/preferences/${payment.preference_id}`,
        { headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` } }
      );
      if (prefRes.ok) {
        const prefData = await prefRes.json();
        metadata = prefData.metadata || metadata;
        if (!externalRef) externalRef = prefData.external_reference;
        console.log(`[Reprocess] Metadata recuperada de preferencia:`, metadata);
      }
    }

    const userId = externalRef || metadata.user_id || metadata.userId;
    const packageId = metadata.package_id || metadata.packageId;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'No se encontró user_id en el pago' }), { status: 400 });
    }
    if (!packageId) {
      return new Response(JSON.stringify({ error: 'No se encontró packageId en metadata', metadata }), { status: 400 });
    }

    const pkg = PACKAGES[packageId];
    if (!pkg) {
      return new Response(JSON.stringify({ error: `Paquete desconocido: ${packageId}` }), { status: 400 });
    }

    // 3. Actualizar perfil
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    let update: Record<string, any>;

    if (pkg.tokens) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('tokens')
        .eq('id', userId)
        .single();

      const currentTokens = profile?.tokens || 0;
      update = { tokens: currentTokens + pkg.tokens, updated_at: new Date().toISOString() };
    } else {
      update = { ...pkg.flags, updated_at: new Date().toISOString() };
    }

    const { error } = await supabase.from('profiles').update(update).eq('id', userId);
    if (error) throw error;

    console.log(`[Reprocess] ✅ Pago ${paymentId} reprocesado | packageId=${packageId} | userId=${userId}`, update);

    return new Response(JSON.stringify({
      success: true,
      message: `✅ Pago ${paymentId} reprocesado correctamente`,
      packageId,
      userId,
      update,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err: any) {
    console.error('[Reprocess] Error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
