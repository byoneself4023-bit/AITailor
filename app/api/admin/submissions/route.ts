import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import type { SubmissionStatus } from '@/types/form';

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();

  // 인증 확인
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as SubmissionStatus | null;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  // 쿼리 빌드
  let query = supabase
    .from('intake_submissions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 상태별 카운트 조회
  const { data: allSubmissions } = await supabase
    .from('intake_submissions')
    .select('status');

  const counts = {
    all: allSubmissions?.length || 0,
    new: allSubmissions?.filter(s => s.status === 'new').length || 0,
    consulting: allSubmissions?.filter(s => s.status === 'consulting').length || 0,
    contracted: allSubmissions?.filter(s => s.status === 'contracted').length || 0,
    completed: allSubmissions?.filter(s => s.status === 'completed').length || 0,
  };

  return NextResponse.json({
    data,
    counts,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}
