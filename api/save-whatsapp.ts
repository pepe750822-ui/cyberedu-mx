import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createManyChatSubscriber } from './_utils/manychat';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const manyChatApiKey = process.env.MANYCHAT_API_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { whatsapp_number } = req.body;

    if (!whatsapp_number) {
      return res.status(400).json({ error: 'WhatsApp number is required' });
    }

    let subscriberId = null;

    // Create subscriber in ManyChat
    if (manyChatApiKey) {
      try {
        const mcResponse = await createManyChatSubscriber(whatsapp_number, manyChatApiKey);
        if (mcResponse.data && mcResponse.data.id) {
          subscriberId = mcResponse.data.id;
        }
      } catch (mcError) {
        console.error('Error syncing to ManyChat:', mcError);
        // Continue even if ManyChat fails, to save in DB
      }
    } else {
      console.warn('MANYCHAT_API_KEY no está configurada');
    }

    // Save in database
    const updateData: any = { whatsapp_number };
    if (subscriberId) {
      updateData.manychat_subscriber_id = subscriberId;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    res.status(200).json({ success: true, subscriberId });
  } catch (error: any) {
    console.error('Error saving WhatsApp:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
}
