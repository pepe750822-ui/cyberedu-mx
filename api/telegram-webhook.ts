import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!TELEGRAM_TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
    return new Response(JSON.stringify({ error: 'Configuración incompleta' }), { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false }
  });

  const url = new URL(req.url);

  // Setup manual
  if (url.searchParams.get('setup') === 'true') {
    const webhookUrl = `https://${url.host}/api/telegram-webhook`;
    const res = await fetch(`${TELEGRAM_API}/setWebhook?url=${webhookUrl}`);
    return new Response(JSON.stringify(await res.json()), { headers: { 'Content-Type': 'application/json' } });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      if (!body.message || !body.message.text) return new Response('OK');

      const chatId = body.message.chat.id.toString();
      const text = body.message.text;
      const firstName = body.message.from?.first_name || 'Usuario';
      const username = body.message.from?.username || '';

      // 1. Obtener estado del usuario (¿vinculado?)
      const { data: tgUser } = await supabase
        .from('telegram_users')
        .select('*, profiles(tokens, full_name)')
        .eq('chat_id', chatId)
        .maybeSingle();

      // Si no existe en telegram_users, crearlo como invitado
      if (!tgUser) {
        await supabase.from('telegram_users').insert({ chat_id: chatId, username, first_name: firstName });
      }

      const lowerText = text.toLowerCase();

      // 2. Manejo de Comandos
      if (lowerText.startsWith('/start')) {
        return sendTelegramMessage(TELEGRAM_API, chatId, getWelcomeMessage(tgUser, firstName));
      }

      if (lowerText === '/vincular') {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        await supabase.from('telegram_users').update({ linking_code: code }).eq('chat_id', chatId);
        return sendTelegramMessage(TELEGRAM_API, chatId, `Tu código de vinculación es: *${code}*\n\nIngrésalo en la web de CyberEdu MX para conectar tu cuenta.`);
      }

      if (lowerText === '/mis_tokens') {
        if (!tgUser?.user_id) return sendTelegramMessage(TELEGRAM_API, chatId, "Aún no has vinculado tu cuenta. Usa /vincular para empezar.");
        const tokens = tgUser.profiles?.tokens || 0;
        return sendTelegramMessage(TELEGRAM_API, chatId, `Tienes *${tokens} tokens* disponibles 🪙.`, [
          [{ text: "💎 Comprar más", url: "https://cyberedumx.com/tokens" }]
        ]);
      }

      // 3. Lógica de preguntas a la IA (/pregunta o cualquier texto si queremos auto-responder)
      if (lowerText.startsWith('/pregunta') || !text.startsWith('/')) {
        const query = text.replace('/pregunta', '').trim();
        if (!query) return sendTelegramMessage(TELEGRAM_API, chatId, "Escribe tu pregunta después del comando. Ejemplo: /pregunta ¿Qué es la fotosíntesis?");

        // A. Caso Usuario Registrado (Vinculado)
        if (tgUser?.user_id) {
          const tokens = tgUser.profiles?.tokens || 0;
          if (tokens <= 0) {
            return sendTelegramMessage(TELEGRAM_API, chatId, "⚠️ No tienes tokens disponibles. Compra más en cyberedumx.com/tokens");
          }

          // Llamar a la IA
          return handleAICall(TELEGRAM_API, chatId, query, tgUser.user_id, url.host, true);
        } 
        
        // B. Caso Usuario Invitado
        else {
          const today = new Date().toISOString().split('T')[0];
          const { data: usage } = await supabase
            .from('telegram_guest_usage')
            .select('*')
            .eq('chat_id', chatId)
            .eq('usage_date', today)
            .maybeSingle();

          const count = usage?.questions_count || 0;
          if (count >= 3) {
            return sendTelegramMessage(TELEGRAM_API, chatId, "🔒 Límite diario alcanzado (3 preguntas).\n\nRegístrate gratis en la web para seguir preguntando: cyberedumx.com/auth");
          }

          // Incrementar uso
          if (usage) {
            await supabase.from('telegram_guest_usage').update({ questions_count: count + 1 }).eq('id', usage.id);
          } else {
            await supabase.from('telegram_guest_usage').insert({ chat_id: chatId, usage_date: today, questions_count: 1 });
          }

          return handleAICall(TELEGRAM_API, chatId, query, null, url.host, false);
        }
      }

      // Otras respuestas por defecto (Keyword match)
      const { replyText, inlineKeyboard } = getReplyForTelegram(text, firstName);
      return sendTelegramMessage(TELEGRAM_API, chatId, replyText, inlineKeyboard);

    } catch (error) {
      console.error('Telegram Error:', error);
      return new Response('OK');
    }
  }

  return new Response('OK');
}

// ─── HELPERS ───

async function sendTelegramMessage(api: string, chatId: string, text: string, keyboard?: any[][]) {
  await fetch(`${api}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      reply_markup: keyboard ? { inline_keyboard: keyboard } : undefined
    })
  });
  return new Response('OK');
}

function getWelcomeMessage(tgUser: any, firstName: string) {
  if (tgUser?.user_id) {
    return `¡Bienvenido de vuelta, ${tgUser.profiles?.full_name || firstName}! 🚀\n\nTienes *${tgUser.profiles?.tokens || 0} tokens* disponibles.\n\nEscríbeme cualquier duda académica o usa /pregunta.`;
  }
  return `¡Hola ${firstName}! Bienvenido a CyberEdu MX 🚀.\n\nComo invitado, tienes *3 preguntas gratis al día* con nuestro Tutor IA.\n\n👉 Para usar tus tokens de la web, usa el comando /vincular.`;
}

async function handleAICall(api: string, chatId: string, question: string, userId: string | null, host: string, isRegistered: boolean) {
  // Notificar que estamos pensando
  await fetch(`${api}/sendChatAction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, action: 'typing' })
  });

  try {
    const aiRes = await fetch(`https://${host}/api/ai-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: question }],
        userId: userId,
        isTelegram: true,
        context: { platform: 'telegram', isRegistered }
      })
    });

    if (!aiRes.ok) throw new Error('IA Error');
    const data = await aiRes.text();
    const cleanText = parseSSEResponse(data);
    return sendTelegramMessage(api, chatId, cleanText);
  } catch (err) {
    return sendTelegramMessage(api, chatId, "Lo siento, tuve un problema conectando con mi cerebro artificial. Reintenta en un momento. 🧠❌");
  }
}

function parseSSEResponse(sseData: string): string {
  const lines = sseData.split('\n');
  let fullText = "";
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      try {
        const jsonStr = line.replace('data: ', '');
        if (jsonStr === '[DONE]') continue;
        const json = JSON.parse(jsonStr);
        const content = json.choices?.[0]?.delta?.content || "";
        fullText += content;
      } catch (e) { /* ignore */ }
    }
  }
  return fullText || "No pude generar una respuesta.";
}

function getReplyForTelegram(text: string, firstName: string): { replyText: string, inlineKeyboard?: any[][] } {
  const lowerMsg = text.toLowerCase();
  const mainKeyboard = [
    [{ text: "🎯 Probar Simulador GRATIS", url: "https://cyberedumx.com/simulador-pro" }],
    [{ text: "💰 Ver Precios y Tokens", url: "https://cyberedumx.com/tokens" }],
    [{ text: "👤 Crear Cuenta Gratis", url: "https://cyberedumx.com/auth" }]
  ];

  if (lowerMsg.includes('precio') || lowerMsg.includes('costo') || lowerMsg.includes('gratis')) {
    return {
      replyText: '¡En CyberEdu MX casi todo es GRATIS! 🎁\n\n✅ Videos y Clases: GRATIS\n✅ Simulador Pro: GRATIS\n\n¿Qué es de pago?\n1. 🤖 **Tutor IA:** 1 token = 1 pregunta.\n2. 🎓 **Curso Udemy:** Opción premium completa.\n\n¿Qué te gustaría consultar?',
      inlineKeyboard: [
        [{ text: "💎 Comprar Tokens IA", url: "https://cyberedumx.com/tokens" }],
        [{ text: "🎓 Curso en Udemy", url: "https://www.udemy.com/course/tu-curso-aqui" }]
      ]
    };
  }
  
  if (lowerMsg.includes('simulador')) {
    return {
      replyText: '¡Claro que sí! Pon a prueba tus conocimientos con nuestro Simulador Pro 100% GRATIS.',
      inlineKeyboard: [[{ text: "🚀 Abrir Simulador GRATIS", url: "https://cyberedumx.com/simulador-pro" }]]
    };
  }
  
  return {
    replyText: `¡Hola! Soy el asistente bot de CyberEdu MX 🤖.\n\nEscribe tu duda académica directamente para usar el Tutor IA, o usa el menú:`,
    inlineKeyboard: mainKeyboard
  };
}
