'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import BasicInfoStep from './FormSteps/BasicInfo';
import UserTypeStep from './FormSteps/UserType';
import FreelancerQuestions from './FormSteps/FreelancerQuestions';
import StartupQuestions from './FormSteps/StartupQuestions';
import MarketerQuestions from './FormSteps/MarketerQuestions';
import ProfessionalQuestions from './FormSteps/ProfessionalQuestions';
import CommonQuestions from './FormSteps/CommonQuestions';

import type { UserType, FormStep } from '@/types/form';

// Zod 스키마
const formSchema = z.object({
  // 기본 정보
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('올바른 이메일을 입력해주세요'),
  phone: z.string().optional(),
  
  // 유형
  userType: z.enum(['freelancer', 'startup', 'marketer', 'professional', 'other']),
  
  // 프리랜서
  freelancer_job: z.string().optional(),
  freelancer_timeConsumingTasks: z.string().optional(),
  freelancer_messageTypes: z.array(z.string()).optional(),
  freelancer_recentClientSituation: z.string().optional(),
  freelancer_aiWishlist: z.string().optional(),
  
  // 스타트업
  startup_companyIntro: z.string().optional(),
  startup_teamSize: z.string().optional(),
  startup_communicationChannels: z.array(z.string()).optional(),
  startup_repetitiveExplanations: z.string().optional(),
  startup_longestEmailSituation: z.string().optional(),
  startup_aiWishlist: z.string().optional(),
  
  // 마케터
  marketer_brandName: z.string().optional(),
  marketer_channels: z.array(z.string()).optional(),
  marketer_contentVolume: z.string().optional(),
  marketer_mostTimeConsumingContent: z.string().optional(),
  marketer_contentCreationProcess: z.string().optional(),
  marketer_successfulContentLink: z.string().optional(),
  
  // 전문직
  professional_specialty: z.string().optional(),
  professional_clientType: z.string().optional(),
  professional_documentTypes: z.array(z.string()).optional(),
  professional_repetitiveExplanations: z.string().optional(),
  professional_recentDocumentSituation: z.string().optional(),
  professional_industryTerms: z.string().optional(),
  
  // 공통
  toneStyle: z.enum(['formal', 'friendly', 'concise', 'flexible']),
  restrictions: z.string().optional(),
  desiredOutcome: z.string().min(1, '원하는 결과를 입력해주세요'),
  aiUsageLevel: z.enum(['paid', 'free', 'rarely', 'never']),
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const STEPS: FormStep[] = ['basic', 'userType', 'typeSpecific', 'common'];

const STEP_TITLES: Record<FormStep, string> = {
  basic: '기본 정보',
  userType: '유형 선택',
  typeSpecific: '상세 정보',
  common: '마무리',
  complete: '완료',
};

export default function IntakeForm() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      freelancer_messageTypes: [],
      startup_communicationChannels: [],
      marketer_channels: [],
      professional_documentTypes: [],
    },
  });
  
  const { watch, handleSubmit, trigger } = methods;
  const userType = watch('userType') as UserType;
  const currentStep = STEPS[currentStepIndex];
  
  // 다음 스텝
  const goNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    switch (currentStep) {
      case 'basic':
        fieldsToValidate = ['name', 'email'];
        break;
      case 'userType':
        fieldsToValidate = ['userType'];
        break;
      case 'typeSpecific':
        if (userType === 'freelancer') {
          fieldsToValidate = ['freelancer_job', 'freelancer_timeConsumingTasks'];
        } else if (userType === 'startup') {
          fieldsToValidate = ['startup_companyIntro', 'startup_teamSize'];
        } else if (userType === 'marketer') {
          fieldsToValidate = ['marketer_brandName'];
        } else if (userType === 'professional') {
          fieldsToValidate = ['professional_specialty'];
        }
        break;
      case 'common':
        fieldsToValidate = ['toneStyle', 'desiredOutcome', 'aiUsageLevel'];
        break;
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // 이전 스텝
  const goBack = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // 폼 제출
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // 1. DB에 저장
      const submitResponse = await fetch('/api/submit-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!submitResponse.ok) throw new Error('제출 실패');

      // 2. AI 분석 요청
      const analyzeResponse = await fetch('/api/analyze-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (analyzeResponse.ok) {
        const analysisResult = await analyzeResponse.json();
        // sessionStorage에 분석 결과 저장
        sessionStorage.setItem('aiAnalysis', JSON.stringify(analysisResult));
      }

      router.push('/thank-you');
    } catch (error) {
      console.error('Submit error:', error);
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 현재 스텝 렌더링
  const renderStep = () => {
    switch (currentStep) {
      case 'basic':
        return <BasicInfoStep />;
      case 'userType':
        return <UserTypeStep />;
      case 'typeSpecific':
        switch (userType) {
          case 'freelancer':
            return <FreelancerQuestions />;
          case 'startup':
            return <StartupQuestions />;
          case 'marketer':
            return <MarketerQuestions />;
          case 'professional':
            return <ProfessionalQuestions />;
          default:
            return <CommonQuestions />;
        }
      case 'common':
        return <CommonQuestions />;
      default:
        return null;
    }
  };
  
  const isLastStep = currentStepIndex === STEPS.length - 1;
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;
  
  return (
    <FormProvider {...methods}>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <div className="text-3xl mb-2">✂️</div>
            <h1 className="text-2xl font-bold text-slate-800">
              AI Tailor
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              맞춤 설정 상담 신청
            </p>
          </div>
          
          {/* 프로그레스 바 */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>{STEP_TITLES[currentStep]}</span>
              <span>{currentStepIndex + 1} / {STEPS.length}</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* 폼 카드 */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* 스텝 컨텐츠 */}
              <div className="min-h-[400px] animate-fadeIn">
                {renderStep()}
              </div>
              
              {/* 버튼 영역 */}
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={currentStepIndex === 0}
                  className="px-6 py-3 text-slate-600 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← 이전
                </button>
                
                {isLastStep ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                  >
                    {isSubmitting ? '제출 중...' : '제출하기'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={goNext}
                    className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-medium"
                  >
                    다음 →
                  </button>
                )}
              </div>
            </form>
          </div>
          
          {/* 안내 문구 */}
          <p className="text-center text-sm text-slate-500 mt-6">
            작성하신 내용은 철저히 비밀이 보장됩니다.
          </p>
        </div>
      </div>
    </FormProvider>
  );
}
