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

    const type = body.type || query.get('type');
    const paymentId = body.data?.id || query.get('data.id') || query.get('id');

    if (type === 'payment' && paymentId) {
      const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
      // Fix #3: soportar tanto SUPABASE_URL (server) como VITE_SUPABASE_URL (legacy)
      const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!MP_ACCESS_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        console.error('[Webhook] Configuración faltante:', {
          hasMP: !!MP_ACCESS_TOKEN,
          hasSupabaseUrl: !!SUPABASE_URL,
          hasServiceKey: !!SUPABASE_SERVICE_ROLE_KEY,
        });
        return new Response('Server configuration error', { status: 500 });
      }

      // 1. Verificar el pago directamente en la API de Mercado Pago
      const mpResp = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` },
      });

      if (!mpResp.ok) throw new Error(`Error al consultar Mercado Pago: ${mpResp.status}`);

      const paymentData = await mpResp.json();
      let { status, external_reference, metadata } = paymentData;

      // Logging detallado inmediato para diagnóstico
      console.log(`[Webhook] ── PAYMENT RAW ──────────────────────────────`);
      console.log(`[Webhook] Payment ID:         ${paymentId}`);
      console.log(`[Webhook] Status:             ${status}`);
      console.log(`[Webhook] external_reference: ${external_reference}`);
      console.log(`[Webhook] preference_id:      ${paymentData.preference_id}`);
      console.log(`[Webhook] payer_email:         ${paymentData.payer?.email}`);
      console.log(`[Webhook] metadata:            ${JSON.stringify(metadata)}`);
      console.log(`[Webhook] ────────────────────────────────────────────`);

      // Fix #2: si metadata está vacía o sin ningún campo identificador, recuperarla de la preferencia.
      // MP no garantiza que /v1/payments/{id} propague la metadata de la preferencia.
      // Antes solo se chequeaba !metadata.type, lo que dejaba pasar casos con type pero sin package_id.
      const isMetadataEmpty = !metadata ||
        (!metadata.type && !metadata.package_id &&
         !metadata.packageId && !metadata.packageid);
      if (isMetadataEmpty && paymentData.preference_id) {
        console.log(`[Webhook] Metadata ausente en pago ${paymentId}, recuperando desde preferencia ${paymentData.preference_id}`);
        const prefResp = await fetch(
          `https://api.mercadopago.com/checkout/preferences/${paymentData.preference_id}`,
          { headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` } }
        );
        if (prefResp.ok) {
          const prefData = await prefResp.json();
          metadata = prefData.metadata || metadata;
          if (!external_reference) external_reference = prefData.external_reference;
          console.log(`[Webhook] Metadata recuperada:`, metadata);
        } else {
          console.warn(`[Webhook] No se pudo recuperar preferencia: ${prefResp.status}`);
        }
      }

      if (status === 'approved' && external_reference) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Fix #1: soportar snake_case (package_id, token_amount) Y camelCase (packageId, tokenAmount)
        // MP snake_casea los keys de metadata al devolverlos en el payment object.
        const metaType      = metadata?.type;
        const metaPackageId = metadata?.package_id      || metadata?.packageId;
        const tokenAmount   = Number(metadata?.token_amount || metadata?.tokenAmount || 0);
        const isTokenPurchase = metaType === 'token_purchase';

        console.log(`[Webhook] Pago aprobado ${paymentId} | type=${metaType} | package=${metaPackageId} | tokens=${tokenAmount} | user=${external_reference}`);
        console.log(`[Webhook] [DEBUG] payer_email:        ${paymentData.payer?.email}`);
        console.log(`[Webhook] [DEBUG] metadata_completa:  ${JSON.stringify(metadata)}`);
        console.log(`[Webhook] [DEBUG] metaPackageId:      ${metaPackageId}`);
        console.log(`[Webhook] [DEBUG] external_reference: ${external_reference}`);

        if (metaPackageId === 'promo_ecoems') {
          // ── Promo ECOEMS 2026: tokens + acceso completo ───────────────
          // Resolver userId (fallback por email si UUID no coincide)
          let promoUserId = external_reference;
          const { data: promoCheck } = await supabase
            .from('profiles').select('id').eq('id', external_reference).maybeSingle();
          if (!promoCheck && paymentData.payer?.email) {
            const { data: byEmail } = await supabase
              .from('profiles').select('id').eq('email', paymentData.payer.email).maybeSingle();
            if (byEmail) {
              promoUserId = byEmail.id;
              console.log(`[Webhook] promo_ecoems: usuario encontrado por email → ${promoUserId}`);
            }
          }

          if (promoUserId) {
            // Obtener tokens actuales primero para evitar null en la suma
            const { data: perfilActual } = await supabase
              .from('profiles')
              .select('tokens')
              .eq('id', promoUserId)
              .single();

            const tokensActuales = Number(perfilActual?.tokens) || 0;

            const updates = {
              tokens: tokensActuales + 150,
              paquete_completo: true,
              practica_ilimitada: true,
              bank5_unlocked: true,
              bank8_unlocked: true,
              bank9_unlocked: true,
              bank10_unlocked: true,
              guia2026_unlocked: true,
              updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
              .from('profiles')
              .update(updates)
              .eq('id', promoUserId);

            if (error) throw error;
            console.log(`[Webhook] ✅ PROMO ECOEMS ACTIVADA → ${tokensActuales} + 150 = ${tokensActuales + 150} tokens + acceso completo | usuario ${promoUserId}`);
          } else {
            console.error(`[Webhook] ❌ USUARIO NO ENCONTRADO para promo_ecoems. UUID: ${external_reference}`);
          }

        } else if (isTokenPurchase && tokenAmount > 0) {
          // ── Compra de tokens ──────────────────────────────────────────
          let { data: profile } = await supabase
            .from('profiles')
            .select('id, tokens, subscription_status')
            .eq('id', external_reference)
            .single();

          // Fallback: buscar por email del pagador si no se encontró por UUID
          if (!profile && paymentData.payer?.email) {
            console.log(`[Webhook] Buscando perfil por email: ${paymentData.payer.email}`);
            const { data: profileByEmail } = await supabase
              .from('profiles')
              .select('id, tokens, subscription_status')
              .eq('email', paymentData.payer.email)
              .single();
            profile = profileByEmail;
          }

          if (profile) {
            const currentTokens = profile.tokens || 0;
            const newTotal = currentTokens + tokenAmount;

            const { error } = await supabase
              .from('profiles')
              .update({
                tokens: newTotal,
                updated_at: new Date().toISOString(),
                subscription_status:
                  metaPackageId === 'ilimitado' ? 'active' : profile.subscription_status,
              })
              .eq('id', profile.id);

            if (error) throw error;
            console.log(`[Webhook] ✅ TOKENS ACREDITADOS: +${tokenAmount} → total ${newTotal} | usuario ${profile.id}`);
          } else {
            console.error(`[Webhook] ❌ USUARIO NO ENCONTRADO. UUID: ${external_reference} | Email: ${paymentData.payer?.email}`);
          }

        } else if (metaPackageId === 'guia2026') {
          // ── Desbloqueo Guía 2026 ──────────────────────────────────────
          let guiaId = external_reference;
          const { data: guiaProfile } = await supabase
            .from('profiles').select('id').eq('id', external_reference).maybeSingle();
          if (!guiaProfile && paymentData.payer?.email) {
            const { data: byEmail } = await supabase
              .from('profiles').select('id').eq('email', paymentData.payer.email).maybeSingle();
            if (byEmail) { guiaId = byEmail.id; console.log(`[Webhook] guia2026: usuario encontrado por email → ${guiaId}`); }
          }

          const { error } = await supabase
            .from('profiles')
            .update({
              bank10_unlocked: true,
              guia2026_unlocked: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', guiaId);

          if (error) throw error;
          console.log(`[Webhook] ✅ GUÍA 2026 DESBLOQUEADA → usuario ${guiaId}`);

        } else if (metaPackageId === 'paquete_completo') {
          // ── Paquete Completo ──────────────────────────────────────────
          let paqId = external_reference;
          const { data: paqProfile } = await supabase
            .from('profiles').select('id').eq('id', external_reference).maybeSingle();
          if (!paqProfile && paymentData.payer?.email) {
            const { data: byEmail } = await supabase
              .from('profiles').select('id').eq('email', paymentData.payer.email).maybeSingle();
            if (byEmail) { paqId = byEmail.id; console.log(`[Webhook] paquete_completo: usuario encontrado por email → ${paqId}`); }
          }

          const { error } = await supabase
            .from('profiles')
            .update({
              bank5_unlocked: true,
              bank8_unlocked: true,
              bank9_unlocked: true,
              bank10_unlocked: true,
              guia2026_unlocked: true,
              paquete_completo: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', paqId);

          if (error) throw error;
          console.log(`[Webhook] ✅ PAQUETE COMPLETO DESBLOQUEADO → usuario ${paqId}`);

        } else if (metaPackageId === 'practica_subindice') {
          // ── Práctica por Subíndice ────────────────────────────────────
          let pracId = external_reference;
          const { data: pracProfile } = await supabase
            .from('profiles').select('id').eq('id', external_reference).maybeSingle();
          if (!pracProfile && paymentData.payer?.email) {
            const { data: byEmail } = await supabase
              .from('profiles').select('id').eq('email', paymentData.payer.email).maybeSingle();
            if (byEmail) { pracId = byEmail.id; console.log(`[Webhook] practica_subindice: usuario encontrado por email → ${pracId}`); }
          }

          const { error } = await supabase
            .from('profiles')
            .update({
              practica_ilimitada: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', pracId);

          if (error) throw error;
          console.log(`[Webhook] ✅ PRÁCTICA POR SUBÍNDICE DESBLOQUEADA → usuario ${pracId}`);

        } else if (metaType === 'subscription' || metaPackageId === 'ilimitado') {
          // ── Suscripción / Maestro ─────────────────────────────────────
          let subsId = external_reference;
          const { data: subsProfile } = await supabase
            .from('profiles').select('id').eq('id', external_reference).maybeSingle();
          if (!subsProfile && paymentData.payer?.email) {
            const { data: byEmail } = await supabase
              .from('profiles').select('id').eq('email', paymentData.payer.email).maybeSingle();
            if (byEmail) { subsId = byEmail.id; console.log(`[Webhook] subscription: usuario encontrado por email → ${subsId}`); }
          }

          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'active',
              is_premium: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', subsId);

          if (error) throw error;
          console.log(`[Webhook] ✅ SUSCRIPCIÓN ACTIVADA → usuario ${subsId}`);

        } else {
          console.warn(`[Webhook] ⚠️ TIPO DESCONOCIDO. external_reference=${external_reference} | metadata=`, metadata);
        }

        // ── Recompensa primera compra al referidor ────────────────────
        try {
          const { data: buyerProfile } = await supabase
            .from('profiles')
            .select('referred_by, first_purchase_rewarded')
            .eq('id', external_reference)
            .single();

          if (buyerProfile?.referred_by && !buyerProfile?.first_purchase_rewarded) {
            await supabase.rpc('award_referral_tokens', { ref_code: buyerProfile.referred_by });
            await supabase.from('profiles').update({ first_purchase_rewarded: true }).eq('id', external_reference);
            console.log(`[Webhook] ✅ Recompensa primera compra acreditada al referidor de ${external_reference}`);
          }
        } catch (refErr: any) {
          console.error('[Webhook] Error en recompensa referido primera compra:', refErr.message);
        }

      } else {
        console.log(`[Webhook] Estado del pago ${paymentId}: ${status} (ignorado)`);
      }
    }

    // Siempre 200 para que MP no reintente el webhook
    return new Response('OK', { status: 200 });

  } catch (error: any) {
    console.error('[Webhook] FALLO INTERNO:', error.message);
    // 200 igual — MP no debe reintentar por errores internos nuestros
    return new Response('Webhook processed with internal errors', { status: 200 });
  }
}
