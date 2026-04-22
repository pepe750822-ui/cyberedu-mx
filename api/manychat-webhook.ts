import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;
    console.log('Webhook ManyChat recibido:', payload);

    // ManyChat typically sends data like:
    // { "subscriber_id": 12345, "custom_fields": { "email": "..." }, "whatsapp_phone": "..." }
    
    // Depending on the exact webhook action from Manychat:
    const subscriberId = payload.subscriber_id;
    const email = payload.email || payload.custom_fields?.email;
    const whatsapp = payload.whatsapp_phone || payload.phone;

    // You can find the user by email or whatsapp in your DB
    if (email) {
      // Find the user by email using Supabase auth
      // For now, let's update their profile if they have one with this email
      // Wait, we don't have the user ID easily unless we query it. 
      // This is a placeholder for updating the DB based on ManyChat webhook
      const { data: users, error: selectError } = await supabase
        .from('profiles')
        .select('id')
        // In a real scenario, you might need a way to link email to profiles. 
        // Profiles table might have an email column or we query auth.users 
        .eq('whatsapp_number', whatsapp)
        .limit(1);
        
      if (users && users.length > 0) {
        // Update the profile with subscriber ID
        await supabase
          .from('profiles')
          .update({ manychat_subscriber_id: subscriberId })
          .eq('id', users[0].id);
      }
    }

    res.status(200).json({ success: true, message: 'Webhook processed' });
  } catch (error: any) {
    console.error('Error en webhook de ManyChat:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
}
