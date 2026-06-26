import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://cyberedumx.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: corsHeaders });
    }

    const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Falta configuración de DB' }), { status: 500, headers: corsHeaders });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Obtener usuario desde el token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Sesión inválida o expirada' }), { status: 401, headers: corsHeaders });
    }

    // 2. Verificar si ya reclamó hoy
    const today = new Date().toISOString().split('T')[0];
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, tokens, last_challenge_reward')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'Perfil no encontrado' }), { status: 404, headers: corsHeaders });
    }

    if (profile.last_challenge_reward === today) {
      return new Response(JSON.stringify({ error: 'Ya has reclamado tu recompensa de hoy' }), { status: 400, headers: corsHeaders });
    }

    // 3. Otorgar recompensa (+1 token)
    const newTokens = (profile.tokens || 0) + 1;
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        tokens: newTokens, 
        last_challenge_reward: today,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      throw new Error('Error al actualizar tokens');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      newTokens,
      message: '¡Felicidades! Has ganado 1 token por completar el reto diario.'
    }), { status: 200, headers: corsHeaders });

  } catch (error: any) {
    console.error('Error en claim-challenge-reward:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
}
