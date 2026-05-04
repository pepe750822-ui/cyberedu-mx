// Edge runtime — single Resend batch call, completes in ~1-2s
export const config = {
  runtime: 'edge',
};

const RECIPIENTS: { email: string; name: string }[] = [
  { email: "raulperez.bachillerato@gmail.com", name: "Raul" },
  { email: "ferrer201135@gmail.com", name: "David" },
  { email: "efrainrm1427@gmail.com", name: "Efrain" },
  { email: "adanwapo1982@gmail.com", name: "Adan" },
  { email: "violetru16@gmail.com", name: "Violet" },
  { email: "coroneltentleabril@gmail.com", name: "Abril" },
  { email: "coronel.tentle.ivan.antonio@gmail.com", name: "Iván" },
  { email: "whoss.maluu@gmail.com", name: "Maria Luisa" },
  { email: "felipaoalonso2024@gmail.com", name: "Felipao" },
  { email: "caguilarplay@gmail.com", name: "Carlos" },
  { email: "mk31tgp@gmail.com", name: "Ian" },
  { email: "yunuheabigail@gmail.com", name: "Yunuhe" },
  { email: "cinthyaleon73@hotmail.com", name: "Cinthya" },
  { email: "adrianarodriguez967@gmail.com", name: "Adriana" },
  { email: "reginaflores252011@gmail.com", name: "Regina" },
  { email: "karlasantiagosoto29@gmail.com", name: "Karla" },
  { email: "sanslu2019a@gmail.com", name: "Luis Pablo" },
  { email: "pablito2016luis@gmail.com", name: "Pablito" },
  { email: "lopezduranpabloarmando@gmail.com", name: "Pablo Armando" },
  { email: "prlopezm@gmail.com", name: "Pablo Rafael" },
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

  // Single batch call — each object has its own subject/html, completes in ~1-2s
  const batch = RECIPIENTS.map((r) => ({
    from: 'CyberEdu MX <noreply@cyberedumx.com>',
    to: r.email,
    subject: `${r.name}, tienes consultas gratis esperándote en CyberEdu MX 🤖`,
    html: buildHtml(r.name),
    text: buildText(r.name),
  }));

  const res = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(batch),
  });

  const data = await res.json() as { data?: { id: string }[]; message?: string };

  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: 'Resend error', detail: data }),
      { status: res.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const results = RECIPIENTS.map((r, i) => ({
    email: r.email,
    name: r.name,
    id: data.data?.[i]?.id ?? null,
  }));

  return new Response(
    JSON.stringify({ ok: true, total: RECIPIENTS.length, sent: results.length, results }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
