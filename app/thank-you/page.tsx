'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Recommendation {
  title: string;
  description: string;
}

interface AnalysisResult {
  success: boolean;
  name: string;
  analysis: {
    summary: string;
    recommendations: Recommendation[];
  };
}

export default function ThankYouPage() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // sessionStorage에서 분석 결과 가져오기
    const stored = sessionStorage.getItem('aiAnalysis');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAnalysis(parsed);
      } catch (e) {
        console.error('Failed to parse analysis:', e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">AI가 분석 중입니다...</p>
        </div>
      </div>
    );
  }

  // 분석 결과가 있는 경우
  if (analysis?.success && analysis.analysis) {
    const { summary, recommendations } = analysis.analysis;

    return (
      <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-2xl mx-auto">
          {/* 성공 헤더 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              신청이 완료되었습니다!
            </h1>
            <p className="text-slate-600">
              {analysis.name}님을 위한 분석 결과입니다.
            </p>
          </div>

          {/* AI 분석 결과 카드 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
            {/* 분석 요약 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📝</span>
                <h2 className="text-lg font-bold text-slate-800">AI 분석</h2>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-slate-700 leading-relaxed">{summary}</p>
              </div>
            </div>

            {/* 추천 자동화 영역 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">💡</span>
                <h3 className="font-semibold text-slate-800">이런 자동화를 제안드릴 예정이에요</h3>
              </div>
              <ul className="space-y-3">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-medium text-slate-800">{rec.title}</h4>
                      <p className="text-sm text-slate-600">{rec.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 다음 단계 안내 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📋</span>
              <h3 className="font-semibold text-slate-800">다음 단계</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-medium">→</span>
                <span><strong>영업일 1~2일 내</strong> 상세 제안서를 이메일로 보내드립니다.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-medium">→</span>
                <span>30분 무료 상담을 통해 구체적인 구현 방안을 논의합니다.</span>
              </li>
            </ul>
          </div>

          {/* 버튼 */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors"
            >
              홈으로 돌아가기
            </Link>
            <p className="text-sm text-slate-500 mt-4">
              궁금한 점: <a href="mailto:byoneself4023@ajou.ac.kr" className="text-blue-600 hover:underline">byoneself4023@ajou.ac.kr</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 분석 결과가 없는 경우 (기존 UI)
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          신청이 완료되었습니다!
        </h1>
        <p className="text-slate-600 mb-8">
          <strong>영업일 기준 1~2일 내</strong>에<br />
          이메일로 연락드리겠습니다.
        </p>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-8 text-left">
          <h2 className="font-medium text-slate-800 mb-3">다음 단계</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">1.</span>
              <span>제출 내용 검토</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">2.</span>
              <span>맞춤 견적 및 제안서 발송</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">3.</span>
              <span>상담 진행 (화상/전화)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">4.</span>
              <span>계약 후 AI 시스템 구축</span>
            </li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors"
        >
          홈으로 돌아가기
        </Link>

        <p className="text-sm text-slate-500 mt-6">
          궁금한 점: <a href="mailto:byoneself4023@ajou.ac.kr" className="text-blue-600 hover:underline">byoneself4023@ajou.ac.kr</a>
        </p>
      </div>
    </div>
  );
}
