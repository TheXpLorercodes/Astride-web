import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const mode = searchParams.get('mode');
  const limitParam = Number.parseInt(searchParams.get('limit') || '12', 10);
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 12;

  try {
    if (id) {
      const { data, error } = await supabaseServer
        .from('launches')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return NextResponse.json({ results: data ? [data] : [] });
    }

    const nowIso = new Date().toISOString();
    let query = supabaseServer.from('launches').select('*');

    if (mode === 'past') {
      query = query.lt('net', nowIso).order('net', { ascending: false });
    } else if (mode === 'upcoming') {
      query = query.gte('net', nowIso).order('net', { ascending: true });
    } else {
      query = query.order('net', { ascending: true });
    }

    const { data, error } = await query.limit(limit);

    if (error) throw new Error(error.message);
    return NextResponse.json({ results: data || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
}
