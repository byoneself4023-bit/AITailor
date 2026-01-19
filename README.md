# AI Tailor ✂️

당신만을 위한 AI 맞춤 설정 서비스

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Form**: React Hook Form + Zod
- **Database**: Supabase
- **Deploy**: Vercel

---

## 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일 편집:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Supabase 테이블 생성

Supabase 대시보드 → SQL Editor에서 실행:

```sql
CREATE TABLE intake_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  user_type TEXT NOT NULL,
  type_answers JSONB,
  tone_style TEXT,
  restrictions TEXT,
  desired_outcome TEXT,
  ai_usage_level TEXT,
  additional_notes TEXT,
  status TEXT DEFAULT 'new'
);

CREATE INDEX idx_intake_email ON intake_submissions(email);

ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert for all" ON intake_submissions
  FOR INSERT WITH CHECK (true);
```

### 4. 개발 서버 실행

```bash
npm run dev
```

- 랜딩페이지: http://localhost:3000
- 상담 신청 폼: http://localhost:3000/intake

---

## 프로젝트 구조

```
ai-tailor/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 랜딩페이지
│   ├── globals.css         # 전역 스타일
│   ├── intake/
│   │   └── page.tsx        # 상담 신청 폼
│   ├── thank-you/
│   │   └── page.tsx        # 완료 페이지
│   └── api/
│       └── submit-intake/
│           └── route.ts    # 폼 제출 API
├── components/
│   ├── IntakeForm.tsx      # 메인 폼 컴포넌트
│   └── FormSteps/          # 폼 스텝 컴포넌트들
├── lib/
│   └── supabase.ts         # Supabase 클라이언트
├── types/
│   └── form.ts             # TypeScript 타입
└── package.json
```

---

## 배포 (Vercel)

```bash
npx vercel
```

환경변수 설정:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 페이지 설명

| 경로 | 설명 |
|------|------|
| `/` | 랜딩페이지 - 서비스 소개 |
| `/intake` | 상담 신청 폼 (멀티스텝) |
| `/thank-you` | 신청 완료 페이지 |

---

## 폼 플로우

```
[기본 정보] → [유형 선택] → [유형별 질문] → [공통 질문] → [완료]
```

유형별 분기:
- 1인 사업자/프리랜서
- 스타트업 대표
- 마케터
- 전문직 (변호사, 의사 등)

---

## 다음 할 일

- [ ] 도메인 연결 (aitailor.kr)
- [ ] 이메일 알림 설정 (Resend)
- [ ] 관리자 대시보드
- [ ] 결제 연동

---

© 2025 AI Tailor
