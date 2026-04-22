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
      
      let chatId, text, firstName, username;

      if (body.callback_query) {
        chatId = body.callback_query.message.chat.id.toString();
        text = body.callback_query.data; // El comando del botón
        firstName = body.callback_query.from?.first_name || 'Usuario';
        username = body.callback_query.from?.username || '';
        
        // Responder al callback para quitar el relojito de Telegram
        await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callback_query_id: body.callback_query.id })
        });
      } else if (body.message && body.message.text) {
        chatId = body.message.chat.id.toString();
        text = body.message.text;
        firstName = body.message.from?.first_name || 'Usuario';
        username = body.message.from?.username || '';
      } else {
        return new Response('OK');
      }

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
        return sendTelegramMessage(TELEGRAM_API, chatId, getWelcomeMessage(tgUser, firstName), getMainKeyboard());
      }

      if (lowerText === '/vincular' || lowerText === '👤 vincular') {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        await supabase.from('telegram_users').update({ linking_code: code }).eq('chat_id', chatId);
        return sendTelegramMessage(
          TELEGRAM_API, 
          chatId, 
          `Tu código de vinculación es: *${code}*\n\nCópialo y haz clic en el botón de abajo para pegarlo en la sección de Tokens de la web.`, 
          [
            [{ text: "🔗 Abrir Web para Vincular", url: "https://cyberedumx.com/tokens" }],
            ...getMainKeyboard()
          ]
        );
      }

      if (lowerText === '/mis_tokens' || lowerText === '🪙 mis tokens') {
        if (!tgUser?.user_id) {
          return sendTelegramMessage(TELEGRAM_API, chatId, "❌ *Cuenta no vinculada*\n\nTodavía estás usando el bot como invitado (límite de 3 preguntas al día).\n\n1. Usa /vincular para obtener un código.\n2. Ingrésalo en cyberedumx.com/tokens");
        }
        const tokens = tgUser.profiles?.tokens || 0;
        const name = tgUser.profiles?.full_name || firstName;
        return sendTelegramMessage(TELEGRAM_API, chatId, `👤 *Cuenta:* ${name}\n🪙 *Balance:* ${tokens} tokens\n\nCada token te da derecho a una **pregunta académica experta** sobre el temario ECOEMS.`, getMainKeyboard());
      }

      // 3. Lógica de preguntas a la IA (/pregunta o cualquier texto si queremos auto-responder)
      if (lowerText.startsWith('/pregunta') || !text.startsWith('/')) {
        const query = text.replace('/pregunta', '').trim();
        if (!query) return sendTelegramMessage(TELEGRAM_API, chatId, "Escribe tu pregunta después del comando. Ejemplo: /pregunta ¿Qué es la fotosíntesis?", getMainKeyboard());

        // A. Caso Usuario Registrado (Vinculado)
        if (tgUser?.user_id) {
          const tokens = tgUser.profiles?.tokens || 0;
          if (tokens <= 0) {
            return sendTelegramMessage(TELEGRAM_API, chatId, "⚠️ No tienes tokens disponibles. Compra más en cyberedumx.com/tokens", getMainKeyboard());
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
            return sendTelegramMessage(TELEGRAM_API, chatId, "🔒 Límite diario alcanzado (3 preguntas).\n\nRegístrate gratis en la web para seguir preguntando: cyberedumx.com/auth", getMainKeyboard());
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

function getMainKeyboard() {
  return [
    [{ text: "🪙 Mis Tokens", callback_data: "/mis_tokens" }, { text: "🚀 Simulador Pro", url: "https://cyberedumx.com/simulador-pro" }],
    [{ text: "💎 Comprar Tokens", url: "https://cyberedumx.com/tokens" }],
    [{ text: "👤 Vincular Cuenta", callback_data: "/vincular" }]
  ];
}

async function sendTelegramMessage(api: string, chatId: string, text: string, inlineKeyboard?: any[][]) {
  const body: any = {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown'
  };

  if (inlineKeyboard) {
    body.reply_markup = { inline_keyboard: inlineKeyboard };
  }

  const replyKeyboard = {
    keyboard: [
      [{ text: "🪙 Mis Tokens" }, { text: "🚀 Simulador Pro" }],
      [{ text: "💎 Comprar Tokens" }, { text: "👤 Vincular" }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  };

  if (!body.reply_markup) {
    body.reply_markup = replyKeyboard;
  }

  await fetch(`${api}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return new Response('OK');
}

function getWelcomeMessage(tgUser: any, firstName: string) {
  if (tgUser?.user_id) {
    return `¡Bienvenido de vuelta, ${tgUser.profiles?.full_name || firstName}! 🚀\n\nTienes *${tgUser.profiles?.tokens || 0} tokens* disponibles para tus **consultas académicas ECOEMS**.\n\nEscríbeme cualquier duda sobre el examen o usa /pregunta.`;
  }
  return `¡Hola ${firstName}! Bienvenido a CyberEdu MX 🚀.\n\nComo invitado, tienes *3 preguntas gratis al día* para resolver tus dudas académicas con nuestro Tutor IA.\n\n👉 Para usar tus tokens de la web (y tener derecho a más preguntas), usa /vincular o el botón de abajo.`;
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
    const rawText = parseSSEResponse(data);
    const cleanText = stripXmlTags(rawText);

    return sendTelegramMessage(api, chatId, cleanText, getMainKeyboard());
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

function stripXmlTags(text: string): string {
  return text
    .replace(/<reasoning>[\s\S]*?<\/reasoning>/g, '')
    .replace(/<recommendation>[\s\S]*?<\/recommendation>/g, '')
    .replace(/<chart>[\s\S]*?<\/chart>/g, '')
    .replace(/<plan>[\s\S]*?<\/plan>/g, '')
    .replace(/<calculator>[\s\S]*?<\/calculator>/g, '')
    .replace(/<simulator>[\s\S]*?<\/simulator>/g, '')
    .replace(/<exercise>[\s\S]*?<\/exercise>/g, '')
    .replace(/<quiz>[\s\S]*?<\/quiz>/g, '')
    .replace(/<chemistry>[\s\S]*?<\/chemistry>/g, '')
    .replace(/<geography>[\s\S]*?<\/geography>/g, '')
    .replace(/<solar_system>[\s\S]*?<\/solar_system>/g, '')
    .replace(/<human_body>[\s\S]*?<\/human_body>/g, '')
    .replace(/<spatial_series>[\s\S]*?<\/spatial_series>/g, '')
    .replace(/<mexico_map>[\s\S]*?<\/mexico_map>/g, '')
    .replace(/<timeline>[\s\S]*?<\/timeline>/g, '')
    .replace(/<atom>[\s\S]*?<\/atom>/g, '')
    .replace(/<algebra>[\s\S]*?<\/algebra>/g, '')
    .trim();
}

function getReplyForTelegram(text: string, firstName: string): { replyText: string, inlineKeyboard?: any[][] } {
  const lowerMsg = text.toLowerCase();
  const mainKeyboard = getMainKeyboard();

  if (lowerMsg.includes('precio') || lowerMsg.includes('costo') || lowerMsg.includes('gratis')) {
    return {
      replyText: '¡En CyberEdu MX el estudio es GRATIS! 🎁\n\n✅ Videos y Clases: GRATIS\n✅ Simulador Pro: GRATIS\n✅ Guías y Material: GRATIS\n\n¿Por qué usar Tokens?\n🤖 **Tutor IA:** Los tokens te dan derecho a realizar **preguntas académicas directas** en Telegram o la Web para resolver dudas específicas del ECOEMS (1 token = 1 consulta).\n\n¿Qué es de pago?\n1. Tokens del Tutor IA.\n2. Curso Premium en Udemy.\n\n¿Qué te gustaría consultar?',
      inlineKeyboard: mainKeyboard
    };
  }
  
  if (lowerMsg.includes('simulador')) {
    return {
      replyText: '¡Claro que sí! Pon a prueba tus conocimientos con nuestro Simulador Pro 100% GRATIS.',
      inlineKeyboard: mainKeyboard
    };
  }
  
  return {
    replyText: `¡Hola! Soy el asistente bot de CyberEdu MX 🤖.\n\nEscribe tu duda académica directamente para usar el Tutor IA, o usa el menú:`,
    inlineKeyboard: mainKeyboard
  };
}
