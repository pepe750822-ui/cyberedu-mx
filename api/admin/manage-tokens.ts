import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { email, amount, action } = await req.json();
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email requerido' }), { status: 400 });
    }

    const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Falta configuración de DB' }), { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Buscar al usuario por email
    const { data: profile, error: findError } = await supabase
      .from('profiles')
      .select('id, email, tokens')
      .eq('email', email)
      .single();

    if (findError || !profile) {
      return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), { status: 404 });
    }

    if (action === 'get') {
      return new Response(JSON.stringify(profile), { status: 200 });
    }

    // 2. Calcular nuevo balance
    const currentTokens = profile.tokens || 0;
    const newTokens = action === 'add' ? currentTokens + amount : Math.max(0, currentTokens - amount);

    // 3. Actualizar
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ tokens: newTokens, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ 
      success: true, 
      email: profile.email, 
      oldTokens: currentTokens, 
      newTokens 
    }), { status: 200 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
