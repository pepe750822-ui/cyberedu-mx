import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  console.log(`[TELEGRAM] Webhook invocado: ${req.method}`);

  if (!TELEGRAM_TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error("[TELEGRAM] Error: Faltan variables de entorno");
    return new Response(JSON.stringify({ error: 'Configuración incompleta' }), { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false }
  });

  const url = new URL(req.url);

  // Setup manual o verificación de salud
  if (url.searchParams.get('setup') === 'true') {
    const webhookUrl = `https://${url.host}/api/telegram-webhook`;
    const res = await fetch(`${TELEGRAM_API}/setWebhook?url=${webhookUrl}`);
    return new Response(JSON.stringify(await res.json()), { headers: { 'Content-Type': 'application/json' } });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    console.log("[TELEGRAM] Update recibido:", JSON.stringify(body).slice(0, 200));
    
    let chatId, text, firstName, username;

    if (body.callback_query) {
      chatId = body.callback_query.message.chat.id.toString();
      text = body.callback_query.data;
      firstName = body.callback_query.from?.first_name || 'Usuario';
      username = body.callback_query.from?.username || '';
      
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
      console.log("[TELEGRAM] Update ignorado (no es texto ni callback)");
      return new Response('OK');
    }

    // 1. Obtener/Crear estado del usuario
    let { data: tgUser } = await supabase
      .from('telegram_users')
      .select('*')
      .eq('chat_id', chatId)
      .maybeSingle();

    if (!tgUser) {
      const { data: newUser } = await supabase
        .from('telegram_users')
        .insert({ chat_id: chatId, username, first_name: firstName })
        .select()
        .single();
      tgUser = newUser;
    }

    // 2. Obtener perfil
    let profile = null;
    if (tgUser?.user_id) {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', tgUser.user_id)
        .maybeSingle();
      profile = userProfile;
    }

    const lowerText = text.toLowerCase();

    // 3. Manejo de Comandos Rápidos
    if (lowerText.startsWith('/start')) {
      return sendTelegramMessage(TELEGRAM_API, chatId, getWelcomeMessage(tgUser, profile, firstName), getMainKeyboard());
    }

    if (lowerText === '/vincular' || lowerText === '👤 vincular') {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      await supabase.from('telegram_users').update({ linking_code: code }).eq('chat_id', chatId);
      return sendTelegramMessage(
        TELEGRAM_API, 
        chatId, 
        `Tu código de vinculación es: *${code}*\n\nIngrésalo en la web para sincronizar tus tokens.`, 
        [[{ text: "🔗 Abrir Web para Vincular", url: "https://cyberedumx.com/tokens" }], ...getMainKeyboard()]
      );
    }

    if (lowerText === '/mis_tokens' || lowerText === '🪙 mis tokens') {
      const tokens = Number(profile?.tokens ?? profile?.token ?? 0);
      const name = profile?.full_name || firstName;
      const status = (profile?.subscription_status === 'active' || profile?.is_premium) ? "💎 Premium" : "🎟️ Estándar";
      return sendTelegramMessage(
        TELEGRAM_API, 
        chatId, 
        `👤 *Cuenta:* ${name}\n✨ *Nivel:* ${status}\n🪙 *Balance:* ${tokens} tokens`, 
        getMainKeyboard()
      );
    }

    // 4. Preguntas a la IA
    if (lowerText.startsWith('/pregunta') || !text.startsWith('/')) {
      const query = text.startsWith('/') ? text.replace(/^\/\w+\s*/, '').trim() : text.trim();
      if (!query) return sendTelegramMessage(TELEGRAM_API, chatId, "Escribe tu pregunta académica. Ejemplo: ¿Qué es la fotosíntesis?", getMainKeyboard());

      console.log(`[TELEGRAM] Procesando pregunta IA: "${query.slice(0, 50)}..."`);
      return handleAICall(TELEGRAM_API, chatId, query, tgUser?.user_id || null, url.host, !!tgUser?.user_id);
    }

    // Fallback por defecto
    const { replyText, inlineKeyboard } = getReplyForTelegram(text, firstName);
    return sendTelegramMessage(TELEGRAM_API, chatId, replyText, inlineKeyboard);

  } catch (error: any) {
    console.error('[TELEGRAM] Error Crítico en Webhook:', error);
    return new Response('OK'); 
  }
}

async function handleAICall(api: string, chatId: string, question: string, userId: string | null, host: string, isRegistered: boolean) {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 25000); // 25s max

  // 1. Mostrar "escribiendo" inmediatamente
  await fetch(`${api}/sendChatAction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, action: 'typing' })
  });

  // 2. Notificación de retraso si tarda más de 5s
  const delayNoticeId = setTimeout(() => {
    fetch(`${api}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: "🧠 *CyberAgent está analizando tu pregunta...* (Esto puede tomar unos segundos)", parse_mode: 'Markdown' })
    }).catch(() => {});
  }, 5000);

  try {
    const aiRes = await fetch(`https://${host}/api/ai-chat`, {
      method: 'POST',
      signal: abortController.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: question }],
        userId,
        isTelegram: true,
        telegramChatId: chatId,
        context: { platform: 'telegram', isRegistered }
      })
    });

    clearTimeout(delayNoticeId);
    clearTimeout(timeoutId);

    if (!aiRes.ok) {
      const err = await aiRes.json().catch(() => ({}));
      return sendTelegramMessage(api, chatId, `⚠️ ${err.error || "No pude conectar con el Tutor IA. Reintenta ahora."}`, getMainKeyboard());
    }

    const data = await aiRes.text();
    const rawText = parseSSEResponse(data);
    
    if (!rawText || rawText.length < 2) {
      return sendTelegramMessage(api, chatId, "❌ Lo siento, la IA no devolvió una respuesta válida. Intenta con otra pregunta.", getMainKeyboard());
    }

    const { cleanText, extraButtons } = processArtifacts(rawText);
    return sendTelegramMessage(api, chatId, cleanText, [...extraButtons, ...getMainKeyboard()]);

  } catch (err: any) {
    clearTimeout(delayNoticeId);
    console.error("[TELEGRAM] Error en llamada IA:", err.name);
    
    const errorMsg = err.name === 'AbortError' 
      ? "⏱️ La respuesta está tardando demasiado. Por favor, intenta con una pregunta más corta o reintenta en un momento."
      : "🧠 Lo siento, tuve un problema técnico procesando tu duda. Usa /start para reiniciar.";
    
    return sendTelegramMessage(api, chatId, errorMsg, getMainKeyboard());
  }
}

function getMainKeyboard() {
  return [
    [{ text: "🪙 Mis Tokens", callback_data: "/mis_tokens" }, { text: "🚀 Simulador Pro", url: "https://cyberedumx.com/simulador-pro" }],
    [{ text: "🌐 Ir a la Web", url: "https://cyberedumx.com" }, { text: "👤 Vincular", callback_data: "/vincular" }]
  ];
}

async function sendTelegramMessage(api: string, chatId: string, text: string, inlineKeyboard?: any[][]) {
  console.log(`[TELEGRAM] Enviando mensaje a ${chatId}`);
  try {
    await fetch(`${api}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.slice(0, 4000), 
        parse_mode: 'Markdown',
        reply_markup: inlineKeyboard ? { inline_keyboard: inlineKeyboard } : {
          keyboard: [[{ text: "🪙 Mis Tokens" }, { text: "🚀 Simulador Pro" }], [{ text: "🌐 Ir a la Web" }, { text: "👤 Vincular" }]],
          resize_keyboard: true
        }
      })
    });
  } catch (e) {
    console.error("[TELEGRAM] Error fatal enviando mensaje:", e);
  }
  return new Response('OK');
}

function getWelcomeMessage(tgUser: any, profile: any, firstName: string) {
  if (tgUser?.user_id) {
    const tokens = profile?.tokens || profile?.token || 0;
    return `¡Bienvenido de vuelta, ${profile?.full_name || firstName}! 🚀\n\nTienes *${tokens} tokens* disponibles para tus **consultas académicas ECOEMS**.\n\nEscríbeme cualquier duda sobre el examen o usa /pregunta.`;
  }
  return `¡Hola ${firstName}! Bienvenido a CyberEdu MX 🚀.\n\nComo invitado, tienes *15 preguntas gratis al día* para resolver tus dudas académicas con nuestro Tutor IA.\n\n👉 Vincula tu cuenta con /vincular para acceder a *25 preguntas diarias* y sincronizar tus tokens.`;
}

function processArtifacts(text: string): { cleanText: string, extraButtons: any[][] } {
  const extraButtons: any[][] = [];
  const recRegex = /<recommendation>([\s\S]*?)<\/recommendation>/g;
  let match;
  while ((match = recRegex.exec(text)) !== null) {
    try {
      const rec = JSON.parse(match[1]);
      if (rec.videoId && rec.areaId) {
        extraButtons.push([{ 
          text: `📺 Ver video: ${rec.title || 'Explicación completa'}`, 
          url: `https://cyberedumx.com/area/${rec.areaId}?video=${rec.videoId}` 
        }]);
      }
    } catch (e) { }
  }

  const hasInteractive = /<(calculator|simulator|algebra|atom|human_body|geography|solar_system|mexico_map|timeline|physics-graph|circuit-lab|force-diagram|lewis-structure|spatial-reasoning-3d)>/.test(text);
  if (hasInteractive) {
    extraButtons.push([{ text: "🚀 Usar simulador interactivo en la Web", url: "https://cyberedumx.com/" }]);
  }

  return { cleanText: stripXmlTags(text), extraButtons };
}

function parseSSEResponse(sseData: string): string {
  const lines = sseData.split('\n');
  let fullText = "";
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      try {
        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') continue;
        const json = JSON.parse(jsonStr);
        const content = json.content || json.choices?.[0]?.delta?.content || "";
        fullText += content;
      } catch (e) { }
    }
  }
  return fullText.trim();
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
    .replace(/<physics-graph>[\s\S]*?<\/physics-graph>/g, '')
    .replace(/<circuit-lab>[\s\S]*?<\/circuit-lab>/g, '')
    .replace(/<force-diagram>[\s\S]*?<\/force-diagram>/g, '')
    .replace(/<lewis-structure>[\s\S]*?<\/lewis-structure>/g, '')
    .replace(/<spatial-reasoning-3d>[\s\S]*?<\/spatial-reasoning-3d>/g, '')
    .replace(/(Mermaid|mermaid)\s*```mermaid[\s\S]*?```/gi, '')
    .replace(/```mermaid[\s\S]*?```/gi, '') 
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

  if (lowerMsg.includes('soporte') || lowerMsg.includes('dudas') || lowerMsg.includes('sugerencia')) {
    return {
      replyText: 'Para cualquier duda personalizada, sugerencia o problema técnico, puedes hablar directamente con nuestro equipo humano por WhatsApp. 📩',
      inlineKeyboard: [
        [{ text: "📩 Abrir WhatsApp de Soporte", url: "https://wa.me/525523269241" }],
        ...mainKeyboard
      ]
    };
  }
  
  return {
    replyText: `¡Hola! Soy el asistente bot de CyberEdu MX 🤖.\n\nEscribe tu duda académica directamente para usar el Tutor IA, o usa el menú:`,
    inlineKeyboard: mainKeyboard
  };
}
