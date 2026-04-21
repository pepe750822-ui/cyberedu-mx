import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Falta configuración de DB' }), { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // GET: Fetch active announcements
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ announcements: data }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
  }

  // POST: Create/Update announcement (Admin only)
  if (req.method === 'POST') {
    const body = await req.json();
    const { content, type, is_active, id } = body;

    if (id) {
        // Update
        const { error } = await supabase
            .from('announcements')
            .update({ content, type, is_active })
            .eq('id', id);
        if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    } else {
        // Create
        const { error } = await supabase
            .from('announcements')
            .insert([{ content, type, is_active: is_active ?? true }]);
        if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  // DELETE: Remove announcement
  if (req.method === 'DELETE') {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return new Response('ID requerido', { status: 400 });

    const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
    
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
