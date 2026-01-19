'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { IntakeSubmission, SubmissionStatus } from '@/types/form';
import { USER_TYPE_LABELS, STATUS_LABELS } from '@/types/form';
import StatusSelect from '@/components/admin/StatusSelect';

// 메시지 유형 라벨
const MESSAGE_TYPE_LABELS: Record<string, string> = {
  quote: '견적서/제안서',
  guide: '작업 안내',
  progress: '진행 상황 공유',
  payment: '결제/정산 안내',
  followup: '팔로업',
  other: '기타',
};

// AI 사용 수준 라벨
const AI_USAGE_LABELS: Record<string, string> = {
  paid: '유료 구독 중',
  free: '무료로 가끔',
  rarely: '거의 안 씀',
  never: '써본 적 없음',
};

// 말투 스타일 라벨
const TONE_STYLE_LABELS: Record<string, string> = {
  formal: '격식체',
  friendly: '친근체',
  concise: '간결체',
  flexible: '상황에 따라',
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface InfoRowProps {
  label: string;
  value: string | React.ReactNode | undefined | null;
}

function InfoRow({ label, value }: InfoRowProps) {
  if (!value) return null;
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

export default function SubmissionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [submission, setSubmission] = useState<IntakeSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await fetch(`/api/admin/submissions/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch submission');
        }
        const data = await response.json();
        setSubmission(data);
      } catch (err) {
        setError('제출 내역을 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [params.id]);

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        로딩 중...
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || '제출 내역을 찾을 수 없습니다.'}</p>
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const typeAnswers = submission.type_answers || {};

  const renderTypeSpecificAnswers = () => {
    switch (submission.user_type) {
      case 'freelancer':
        return (
          <>
            <InfoRow label="직업" value={typeAnswers.job as string} />
            <InfoRow label="시간이 많이 드는 업무" value={typeAnswers.timeConsumingTasks as string} />
            <InfoRow
              label="자주 보내는 메시지 유형"
              value={
                Array.isArray(typeAnswers.messageTypes)
                  ? (typeAnswers.messageTypes as string[])
                      .map(t => MESSAGE_TYPE_LABELS[t] || t)
                      .join(', ')
                  : undefined
              }
            />
            <InfoRow label="최근 고객 응대 상황" value={typeAnswers.recentClientSituation as string} />
            <InfoRow label="AI가 대신해줬으면 하는 업무" value={typeAnswers.aiWishlist as string} />
          </>
        );
      case 'startup':
        return (
          <>
            <InfoRow label="회사/서비스 소개" value={typeAnswers.companyIntro as string} />
            <InfoRow label="팀 규모" value={typeAnswers.teamSize as string} />
            <InfoRow label="팀 커뮤니케이션 채널" value={typeAnswers.communicationChannels as string} />
            <InfoRow label="반복적으로 설명하는 내용" value={typeAnswers.repetitiveExplanations as string} />
            <InfoRow label="가장 오래 걸린 이메일 상황" value={typeAnswers.longestEmailSituation as string} />
            <InfoRow label="AI가 대신해줬으면 하는 업무" value={typeAnswers.aiWishlist as string} />
          </>
        );
      case 'marketer':
        return (
          <>
            <InfoRow label="브랜드명" value={typeAnswers.brandName as string} />
            <InfoRow label="담당 마케팅 채널" value={typeAnswers.channels as string} />
            <InfoRow label="월 콘텐츠 제작량" value={typeAnswers.contentVolume as string} />
            <InfoRow label="가장 시간 많이 드는 콘텐츠" value={typeAnswers.mostTimeConsumingContent as string} />
            <InfoRow label="콘텐츠 제작 프로세스" value={typeAnswers.contentCreationProcess as string} />
            <InfoRow label="성공적인 콘텐츠 링크" value={typeAnswers.successfulContentLink as string} />
          </>
        );
      case 'professional':
        return (
          <>
            <InfoRow label="전문 분야" value={typeAnswers.specialty as string} />
            <InfoRow label="주요 고객층" value={typeAnswers.clientType as string} />
            <InfoRow label="자주 작성하는 문서 유형" value={typeAnswers.documentTypes as string} />
            <InfoRow label="반복적으로 설명하는 내용" value={typeAnswers.repetitiveExplanations as string} />
            <InfoRow label="최근 문서 작성 상황" value={typeAnswers.recentDocumentSituation as string} />
            <InfoRow label="업계 전문 용어" value={typeAnswers.industryTerms as string} />
          </>
        );
      default:
        return (
          <InfoRow
            label="기타 답변"
            value={JSON.stringify(typeAnswers, null, 2)}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin"
            className="text-gray-500 hover:text-gray-700"
          >
            ← 목록으로
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {submission.name}님의 신청서
          </h1>
        </div>
        <div className="w-48">
          <StatusSelect
            submissionId={submission.id}
            currentStatus={submission.status}
          />
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">기본 정보</h2>
        </div>
        <dl className="px-6 py-4">
          <InfoRow label="이름" value={submission.name} />
          <InfoRow label="이메일" value={submission.email} />
          <InfoRow label="연락처" value={submission.phone} />
          <InfoRow label="유형" value={USER_TYPE_LABELS[submission.user_type]} />
          <InfoRow label="신청일" value={formatDate(submission.created_at)} />
        </dl>
      </div>

      {/* 유형별 답변 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">
            {USER_TYPE_LABELS[submission.user_type]} 상세 답변
          </h2>
        </div>
        <dl className="px-6 py-4">
          {renderTypeSpecificAnswers()}
        </dl>
      </div>

      {/* 공통 답변 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">공통 답변</h2>
        </div>
        <dl className="px-6 py-4">
          <InfoRow
            label="평소 글/말투 스타일"
            value={submission.tone_style ? TONE_STYLE_LABELS[submission.tone_style] : undefined}
          />
          <InfoRow label="AI 금지사항" value={submission.restrictions} />
          <InfoRow label="원하는 결과" value={submission.desired_outcome} />
          <InfoRow
            label="AI 도구 사용 수준"
            value={submission.ai_usage_level ? AI_USAGE_LABELS[submission.ai_usage_level] : undefined}
          />
          <InfoRow label="추가 전달사항" value={submission.additional_notes} />
        </dl>
      </div>
    </div>
  );
}
