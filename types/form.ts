// 사용자 유형
export type UserType = 
  | 'freelancer'      // 1인 사업자/프리랜서
  | 'startup'         // 스타트업 대표
  | 'marketer'        // 마케터
  | 'professional'    // 전문직
  | 'other';          // 기타

// 말투 스타일
export type ToneStyle = 
  | 'formal'          // 격식체
  | 'friendly'        // 친근체
  | 'concise'         // 간결체
  | 'flexible';       // 상황에 따라

// AI 사용 수준
export type AIUsageLevel = 
  | 'paid'            // 유료 구독 중
  | 'free'            // 무료로 가끔
  | 'rarely'          // 거의 안 씀
  | 'never';          // 써본 적 없음

// 폼 스텝 정의
export type FormStep =
  | 'basic'           // 기본 정보
  | 'userType'        // 유형 선택
  | 'typeSpecific'    // 유형별 질문
  | 'common'          // 공통 질문
  | 'complete';       // 완료

// 제출 상태
export type SubmissionStatus =
  | 'new'             // 신규
  | 'consulting'      // 상담중
  | 'contracted'      // 계약
  | 'completed';      // 완료

// 제출 데이터 타입
export interface IntakeSubmission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  user_type: UserType;
  type_answers?: Record<string, unknown>;
  tone_style?: ToneStyle;
  restrictions?: string;
  desired_outcome?: string;
  ai_usage_level?: AIUsageLevel;
  additional_notes?: string;
  status: SubmissionStatus;
}

// 상태 라벨
export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  new: '신규',
  consulting: '상담중',
  contracted: '계약',
  completed: '완료',
};

// 유형 라벨
export const USER_TYPE_LABELS: Record<UserType, string> = {
  freelancer: '1인 사업자/프리랜서',
  startup: '스타트업 대표',
  marketer: '마케터',
  professional: '전문직',
  other: '기타',
};
