import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

  // Verificar que el token esté configurado
  if (!TELEGRAM_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN no está configurado en las variables de entorno.');
    return new Response(JSON.stringify({ 
      error: 'Configuración incompleta', 
      detail: 'Falta VITE_TELEGRAM_BOT_TOKEN en las variables de entorno de Vercel.' 
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  // Configuración manual del webhook vía URL (GET /api/telegram-webhook?setup=true)
  if (req.method === 'GET') {
    const url = new URL(req.url);
    if (url.searchParams.get('setup') === 'true') {
      const webhookUrl = `https://${url.host}/api/telegram-webhook`;
      
      try {
        const setupRes = await fetch(`${TELEGRAM_API}/setWebhook?url=${webhookUrl}`);
        const setupData = await setupRes.json();
        return new Response(JSON.stringify({
          message: 'Intento de configuración de Webhook completado',
          webhook_url: webhookUrl,
          telegram_response: setupData
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Error configurando webhook' }), { status: 500 });
      }
    }
    
    return new Response('El Webhook de Telegram está activo. Usa ?setup=true en la URL para conectarlo a tu Bot.', { 
      status: 200, 
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();

      // Verificar si hay un mensaje de texto
      if (body.message && body.message.text) {
        const chatId = body.message.chat.id;
        const text = body.message.text;
        const firstName = body.message.from?.first_name || 'Usuario';
        const username = body.message.from?.username || '';

        console.log(`Mensaje de Telegram recibido [${chatId}]: ${text}`);

        // A. Generar respuesta automática basada en palabras clave
        const replyText = getReplyForTelegram(text, firstName);

        // B. Enviar la respuesta vía API de Telegram
        await fetch(`${TELEGRAM_API}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: replyText
          })
        });

        // C. Guardar el lead en Supabase
        const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (SUPABASE_URL && SUPABASE_KEY) {
          await saveTelegramLeadInSupabase(SUPABASE_URL, SUPABASE_KEY, chatId.toString(), username, firstName, text);
        } else {
          console.error('Faltan las credenciales de Supabase. El lead no se guardó.');
        }
      }

      // IMPORTANTE: Telegram requiere que siempre devolvamos 200 OK para no reintentar mensajes
      return new Response('OK', { status: 200 });
    } catch (error) {
      console.error('Error procesando webhook de Telegram:', error);
      // Siempre devolver 200 incluso si hay error, para evitar bloqueos del webhook
      return new Response('ERROR', { status: 200 });
    }
  }

  return new Response('Método no permitido', { status: 405 });
}

// ==========================================
// LÓGICA DE RESPUESTAS Y BASE DE DATOS
// ==========================================

function getReplyForTelegram(text: string, firstName: string): string {
  const lowerMsg = text.toLowerCase();

  if (lowerMsg.includes('hola') || lowerMsg.includes('/start') || lowerMsg.includes('buenas')) {
    return `¡Hola ${firstName}! Bienvenido a CyberEdu MX 🚀.\n\nEstamos aquí para ayudarte a pasar tu examen ECOEMS 2026. Visita nuestra página principal: https://cyberedumx.com`;
  }
  
  if (lowerMsg.includes('precio') || lowerMsg.includes('costo') || lowerMsg.includes('pagar')) {
    return '¡Buenas noticias! El contenido multimedia es GRATIS 🎁.\n\nPara interactuar sin límites con nuestro Tutor IA, los tokens inician desde solo $10 MXN. Consíguelos aquí: https://cyberedumx.com/tokens';
  }
  
  if (lowerMsg.includes('simulador')) {
    return '¡Claro que sí! Pon a prueba tus conocimientos con nuestro Simulador Pro aquí: https://cyberedumx.com/simulador-pro';
  }
  
  if (lowerMsg.includes('registro') || lowerMsg.includes('crear cuenta') || lowerMsg.includes('apuntarme')) {
    return '¡Excelente decisión! Regístrate gratis y accede a los recursos: https://cyberedumx.com/auth';
  }
  
  // Respuesta por defecto
  return `¡Hola! Soy el asistente bot de CyberEdu MX 🤖.\n\nEscribe alguna de estas palabras clave:\n• PRECIO\n• SIMULADOR\n• REGISTRO\n\nO visita: https://cyberedumx.com`;
}

async function saveTelegramLeadInSupabase(supabaseUrl: string, supabaseKey: string, chatId: string, username: string, firstName: string, lastMessage: string) {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  try {
    const { data: existingLead, error: searchError } = await supabase
      .from('telegram_leads')
      .select('id, messages_count')
      .eq('chat_id', chatId)
      .maybeSingle();

    if (searchError) {
      console.error('Error buscando lead de Telegram:', searchError);
      return;
    }

    if (existingLead) {
      const newCount = (existingLead.messages_count || 0) + 1;
      await supabase
        .from('telegram_leads')
        .update({
          username: username,
          first_name: firstName,
          last_message: lastMessage,
          messages_count: newCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingLead.id);
    } else {
      await supabase
        .from('telegram_leads')
        .insert({
          chat_id: chatId,
          username: username,
          first_name: firstName,
          last_message: lastMessage,
          messages_count: 1
        });
    }
  } catch (err) {
    console.error('Excepción guardando lead de Telegram:', err);
  }
}
