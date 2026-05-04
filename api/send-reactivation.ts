// Node runtime — edge limit (30s) is too tight for 21 emails × 500ms delay
export const config = {
  runtime: 'nodejs',
  maxDuration: 60,
};

const RECIPIENTS: { email: string; name: string }[] = [
  { email: "kekisalher@gmail.com", name: "Kevin" },
  { email: "jsaz._2811@icloud.com", name: "Yaz" },
  { email: "jfespinoza@gmail.com", name: "Juan Francisco" },
  { email: "lucibahngonz@gmail.com", name: "Luci" },
  { email: "carloscerlira@gmail.com", name: "Carlos" },
  { email: "renataramirezrrr03@gmail.com", name: "Renata" },
  { email: "jafetacad@gmail.com", name: "Jafet" },
  { email: "andresalvarezpenaloza@gmail.com", name: "Andres" },
  { email: "chenitarodriguez31@gmail.com", name: "Azucena" },
  { email: "mar438202@gmail.com", name: "Mar" },
  { email: "avilaelianyael@gmail.com", name: "Elian" },
  { email: "altairreynaperez@gmail.com", name: "Aurora" },
  { email: "karenveragarcia893@gmail.com", name: "Lizzy" },
  { email: "santiagogalvan339@gmail.com", name: "Santiago" },
  { email: "cowa7876@gmail.com", name: "Mauricio" },
  { email: "kuramazappinzone5@gmail.com", name: "Andres" },
  { email: "gaste.0302@gmail.com", name: "Jehieli" },
  { email: "angelperezsalinas1502@gmail.com", name: "Angel" },
  { email: "wtf.mar.ramirez19@gmail.com", name: "Mar" },
  { email: "cig090511@gmail.com", name: "Cristian" },
  { email: "nicolasemilio194@gmail.com", name: "Emilio Nicolas" },
];

const buildHtml = (name: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name}, tienes consultas gratis esperándote</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">

          <!-- Header gradient -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#6366f1);padding:32px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:#ddd6fe;">CyberEdu MX</p>
              <h1 style="margin:0;font-size:26px;font-weight:900;color:#ffffff;line-height:1.25;">
                ¡${name}, tu Tutor IA<br/>sigue aquí esperándote! 🤖
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">

              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#cbd5e1;">
                ¡Hola, ${name}! 👋
              </p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#94a3b8;">
                Te registraste en CyberEdu MX pero aún no has probado el
                <strong style="color:#a78bfa;">Tutor IA</strong> — la herramienta que más
                ayuda a los estudiantes a entender los temas del ECOEMS y COMIPEMS.
              </p>

              <!-- Free consultations badge -->
              <div style="background:linear-gradient(135deg,#064e3b,#065f46);border:1px solid #10b981;border-radius:12px;padding:16px 24px;text-align:center;margin-bottom:28px;">
                <p style="margin:0 0 4px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6ee7b7;">Tu saldo disponible</p>
                <p style="margin:0;font-size:28px;font-weight:900;color:#34d399;">25 consultas gratis</p>
                <p style="margin:4px 0 0;font-size:13px;color:#6ee7b7;">Sin tarjeta · Sin límite de temas</p>
              </div>

              <!-- 4 benefit bullets -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr><td style="padding:10px 0;border-bottom:1px solid #334155;">
                  <span style="color:#a78bfa;font-size:20px;margin-right:12px;">🤖</span>
                  <span style="font-size:14px;font-weight:700;color:#e2e8f0;">Tutor IA 24/7</span>
                  <span style="font-size:13px;color:#94a3b8;"> — explica cualquier tema del examen al instante</span>
                </td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #334155;">
                  <span style="color:#fb923c;font-size:20px;margin-right:12px;">📝</span>
                  <span style="font-size:14px;font-weight:700;color:#e2e8f0;">Simulador ECOEMS</span>
                  <span style="font-size:13px;color:#94a3b8;"> — 512 reactivos tipo examen real</span>
                </td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #334155;">
                  <span style="color:#f472b6;font-size:20px;margin-right:12px;">🎬</span>
                  <span style="font-size:14px;font-weight:700;color:#e2e8f0;">90+ videos educativos</span>
                  <span style="font-size:13px;color:#94a3b8;"> — estilo anime, fáciles de entender</span>
                </td></tr>
                <tr><td style="padding:10px 0;">
                  <span style="color:#34d399;font-size:20px;margin-right:12px;">📈</span>
                  <span style="font-size:14px;font-weight:700;color:#e2e8f0;">Seguimiento de progreso</span>
                  <span style="font-size:13px;color:#94a3b8;"> — sabe en qué temas mejorar</span>
                </td></tr>
              </table>

              <!-- Urgency block -->
              <div style="background:#1e1b4b;border:1px solid #4f46e5;border-radius:12px;padding:16px 24px;margin-bottom:32px;text-align:center;">
                <p style="margin:0;font-size:13px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#a5b4fc;">⏰ El ECOEMS es el 20–28 de junio</p>
                <p style="margin:6px 0 0;font-size:14px;color:#c7d2fe;">Quedan pocas semanas. Cada día de práctica cuenta.</p>
              </div>

              <!-- CTA button -->
              <div style="text-align:center;margin-bottom:8px;">
                <a href="https://cyberedumx.com" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#6366f1);color:#ffffff;font-size:16px;font-weight:900;text-decoration:none;padding:16px 44px;border-radius:50px;letter-spacing:0.04em;box-shadow:0 4px 24px rgba(124,58,237,0.45);">
                  Usar mis consultas gratis →
                </a>
              </div>
              <p style="margin:12px 0 0;text-align:center;font-size:12px;color:#475569;">
                Entra en <a href="https://cyberedumx.com" style="color:#7c3aed;text-decoration:none;">cyberedumx.com</a> · Completamente gratis
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;padding:24px 40px;text-align:center;border-top:1px solid #334155;">
              <p style="margin:0 0 4px;font-size:12px;color:#475569;">© 2026 CyberEdu MX — PrepáraTE para el ECOEMS</p>
              <p style="margin:0;font-size:11px;color:#334155;">
                Recibiste este email porque te registraste en nuestra plataforma.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const buildText = (name: string) => `
¡Hola, ${name}! 👋

Te registraste en CyberEdu MX pero aún no has probado el Tutor IA.

Tienes 25 consultas gratis esperándote — sin tarjeta, sin límite de temas.

Lo que encontrarás en cyberedumx.com:
• Tutor IA 24/7 — explica cualquier tema del examen al instante
• Simulador ECOEMS con 512 reactivos tipo examen real
• 90+ videos educativos estilo anime
• Seguimiento de tu progreso

⏰ El ECOEMS es el 20–28 de junio. Cada día de práctica cuenta.

Entra gratis: https://cyberedumx.com

Éxito,
El equipo CyberEdu MX
`.trim();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), { status: 500 });
  }

  let body: { secret?: string } = {};
  try { body = await req.json(); } catch { /* no body */ }
  const SEND_SECRET = process.env.REACTIVATION_SEND_SECRET;
  if (SEND_SECRET && body.secret !== SEND_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const results: { email: string; status: 'ok' | 'error'; id?: string; error?: string }[] = [];

  for (const recipient of RECIPIENTS) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'CyberEdu MX <noreply@cyberedumx.com>',
          to: recipient.email,
          subject: `${recipient.name}, tienes consultas gratis esperándote en CyberEdu MX 🤖`,
          html: buildHtml(recipient.name),
          text: buildText(recipient.name),
        }),
      });

      const data = await res.json() as { id?: string; message?: string };

      if (res.ok) {
        results.push({ email: recipient.email, status: 'ok', id: data.id });
        console.log(`[reactivation] ✓ ${recipient.email}`);
      } else {
        results.push({ email: recipient.email, status: 'error', error: data.message ?? String(res.status) });
        console.error(`[reactivation] ✗ ${recipient.email}:`, data.message);
      }
    } catch (err: any) {
      results.push({ email: recipient.email, status: 'error', error: err.message });
      console.error(`[reactivation] ✗ ${recipient.email}:`, err.message);
    }

    // 500ms between sends to stay within Resend rate limits
    await sleep(500);
  }

  const sent = results.filter((r) => r.status === 'ok').length;
  const failed = results.filter((r) => r.status === 'error').length;

  return new Response(
    JSON.stringify({ ok: true, total: RECIPIENTS.length, sent, failed, results }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
