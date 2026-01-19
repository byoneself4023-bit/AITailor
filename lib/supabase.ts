import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
===========================================
Supabase 테이블 생성 SQL
===========================================
Supabase 대시보드 → SQL Editor에서 아래 쿼리 실행:

CREATE TABLE intake_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 기본 정보
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- 유형
  user_type TEXT NOT NULL,
  
  -- 유형별 답변 (JSON)
  type_answers JSONB,
  
  -- 공통 답변
  tone_style TEXT,
  restrictions TEXT,
  desired_outcome TEXT,
  ai_usage_level TEXT,
  additional_notes TEXT,
  
  -- 상태
  status TEXT DEFAULT 'new'
);

-- 이메일 인덱스
CREATE INDEX idx_intake_email ON intake_submissions(email);

-- RLS 정책
ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert for all" ON intake_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select for authenticated" ON intake_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- UPDATE 권한 추가 (인증된 사용자만)
CREATE POLICY "Allow update for authenticated" ON intake_submissions
  FOR UPDATE USING (auth.role() = 'authenticated');
*/
