import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // 1. Validar variables de entorno de Supabase
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase environment variables');
  }

  // 2. Endpoint de salud / Verificación GET (Usado por servicios como Chatfuel)
  if (req.method === 'GET') {
    return new Response(JSON.stringify({ status: 'ok', message: 'Chatfuel Webhook is running' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 3. Manejar los mensajes entrantes de Chatfuel (POST)
  if (req.method === 'POST') {
    try {
      const body = await req.json();

      // Extraer datos según formato de Chatfuel: { "messages": [{"text": "...", "sender": {"id": "...", "first_name": "..."}}] }
      let contactPhone = '';
      let messageText = '';

      if (body.messages && body.messages.length > 0) {
        const message = body.messages[0];
        contactPhone = message.sender?.id || '';
        messageText = message.text || '';
      } else {
        // Fallback robusto por si envía en su formato nativo JSON API flat
        contactPhone = body['messenger user id'] || body.sender_id || body.chat_id || 'unknown';
        messageText = body['last user freeform input'] || body.text || '';
      }

      console.log(`Mensaje recibido vía Chatfuel de ${contactPhone}: ${messageText}`);

      // A. Procesar la respuesta automática
      const replyText = getReplyForMessage(messageText);

      // B. Guardar el lead en Supabase
      if (SUPABASE_URL && SUPABASE_KEY && contactPhone !== 'unknown' && messageText) {
        await saveLeadInSupabase(SUPABASE_URL, SUPABASE_KEY, contactPhone, messageText);
      }

      // C. Responder a Chatfuel sincronamente con el formato JSON API que exige
      const chatfuelResponse = {
        messages: [
          { text: replyText }
        ]
      };

      return new Response(JSON.stringify(chatfuelResponse), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Error procesando el webhook de Chatfuel:', error);
      // Responder a Chatfuel con un mensaje genérico en caso de error
      return new Response(JSON.stringify({
        messages: [{ text: "Ocurrió un error procesando tu mensaje. Intenta de nuevo más tarde." }]
      }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
  }

  return new Response('Método no permitido', { status: 405 });
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function getReplyForMessage(text: string): string {
  const lowerMsg = text.toLowerCase();

  if (lowerMsg.includes('hola') || lowerMsg.includes('buenas') || lowerMsg.includes('saludos')) {
    return '¡Hola! Bienvenido a CyberEdu MX 🚀. Estamos aquí para ayudarte a pasar tu examen ECOEMS 2026.\nVisita nuestra página principal y descubre cómo: https://cyberedumx.com';
  } 
  
  if (lowerMsg.includes('precio') || lowerMsg.includes('costo') || lowerMsg.includes('cuánto') || lowerMsg.includes('cuanto') || lowerMsg.includes('pagar')) {
    return '¡Buenas noticias! Todo nuestro contenido multimedia, videos y simuladores son completamente GRATIS 🎁.\nSi deseas interactuar sin límites con nuestro Tutor IA avanzado, los paquetes de tokens inician desde solo $10 MXN.\nConsigue tus tokens aquí: https://cyberedumx.com/tokens';
  } 
  
  if (lowerMsg.includes('simulador')) {
    return '¡Claro! Pon a prueba tus conocimientos con nuestro Simulador Pro y ve qué tan preparado estás.\nIngresa aquí: https://cyberedumx.com/simulador-pro';
  } 
  
  if (lowerMsg.includes('registro') || lowerMsg.includes('crear cuenta') || lowerMsg.includes('apuntarme')) {
    return '¡Excelente decisión! Regístrate gratis y accede a todos nuestros recursos.\nCrea tu cuenta aquí: https://cyberedumx.com/auth';
  } 
  
  if (lowerMsg.includes('tutor') || lowerMsg.includes('ia') || lowerMsg.includes('chat') || lowerMsg.includes('duda')) {
    return 'Nuestro Tutor IA está listo para resolver todas tus dudas sobre el examen ECOEMS.\nIngresa a la plataforma para empezar a chatear: https://cyberedumx.com';
  } 
  
  if (lowerMsg.includes('contacto') || lowerMsg.includes('soporte') || lowerMsg.includes('ayuda')) {
    return 'Si necesitas ayuda adicional o tienes problemas con tu cuenta, por favor escríbenos a soporte@cyberedumx.com y te atenderemos lo más pronto posible 🛠️.';
  }

  // Respuesta por defecto si no coincide ninguna palabra clave
  return '¡Hola! Soy el asistente virtual de CyberEdu MX 🤖.\n\nEscribe alguna de estas palabras clave para recibir información exacta:\n• PRECIO: Para conocer nuestros costos.\n• SIMULADOR: Para ir al simulador de examen.\n• REGISTRO: Para crear tu cuenta gratuita.\n• TUTOR: Para conocer a nuestra IA.\n\nO visita nuestra página principal: https://cyberedumx.com';
}

async function saveLeadInSupabase(supabaseUrl: string, supabaseKey: string, phone: string, lastMessage: string) {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  try {
    const { data: existingLead, error: searchError } = await supabase
      .from('whatsapp_leads')
      .select('id, messages_count')
      .eq('phone_number', phone)
      .maybeSingle();

    if (searchError) {
      console.error('Error buscando lead en Supabase:', searchError);
      return;
    }

    if (existingLead) {
      const newCount = (existingLead.messages_count || 0) + 1;
      const { error: updateError } = await supabase
        .from('whatsapp_leads')
        .update({
          last_message: lastMessage,
          messages_count: newCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingLead.id);

      if (updateError) console.error('Error actualizando lead:', updateError);
    } else {
      const { error: insertError } = await supabase
        .from('whatsapp_leads')
        .insert({
          phone_number: phone,
          last_message: lastMessage,
          messages_count: 1
        });

      if (insertError) console.error('Error insertando nuevo lead:', insertError);
    }
  } catch (err) {
    console.error('Excepción guardando lead en Supabase:', err);
  }
}
