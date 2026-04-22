import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const jsonResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  };

  if (req.method === 'OPTIONS') {
    return jsonResponse({ ok: true });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Método no permitido' }, 405);
  }

  try {
    const { userId, linkingCode } = await req.json();

    if (!userId || !linkingCode) {
      return jsonResponse({ error: 'Faltan datos requeridos' }, 400);
    }

    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return jsonResponse({ error: 'Configuración de base de datos incompleta' }, 500);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });

    // 1. Buscar si el código existe y es válido
    const { data: telegramUser, error: findError } = await supabase
      .from('telegram_users')
      .select('*')
      .eq('linking_code', linkingCode.trim().toUpperCase())
      .single();

    if (findError || !telegramUser) {
      return jsonResponse({ error: 'Código de vinculación inválido o expirado' }, 404);
    }

    // 2. Vincular el chat_id con el user_id de la web
    const { error: updateError } = await supabase
      .from('telegram_users')
      .update({
        user_id: userId,
        linking_code: null, // Limpiar el código usado
        linked_at: new Date().toISOString()
      })
      .eq('chat_id', telegramUser.chat_id);

    if (updateError) {
      throw updateError;
    }

    return jsonResponse({ 
      success: true, 
      message: '¡Bot de Telegram vinculado con éxito!',
      chat_id: telegramUser.chat_id
    });

  } catch (error: any) {
    console.error('Error en vinculación Telegram:', error);
    return jsonResponse({ error: error.message || 'Error interno del servidor' }, 500);
  }
}
