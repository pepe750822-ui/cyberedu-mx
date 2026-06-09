import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') return res.status(405).end()
  
  const { email, adminSecret } = req.body
  
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabaseAdmin.auth.admin
    .generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: 'https://cyberedumx.com'
      }
    })

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  // Activar paquete_completo si el perfil existe
  const { data: perfil } = await supabaseAdmin
    .from('profiles')
    .select('id, tokens')
    .eq('email', email)
    .maybeSingle()

  if (perfil) {
    await supabaseAdmin
      .from('profiles')
      .update({
        paquete_completo: true,
        practica_ilimitada: true,
        bank5_unlocked: true,
        bank8_unlocked: true,
        bank9_unlocked: true,
        bank10_unlocked: true,
        guia2026_unlocked: true,
        tokens: perfil.tokens + 150
      })
      .eq('id', perfil.id)
  }

  return res.status(200).json({ 
    link: data.properties?.action_link,
    email 
  })
}
