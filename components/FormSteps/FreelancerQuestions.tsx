'use client';

import { useFormContext } from 'react-hook-form';

const MESSAGE_TYPES = [
  { value: 'quote', label: '견적서/제안서' },
  { value: 'guide', label: '작업 안내' },
  { value: 'progress', label: '진행 상황 공유' },
  { value: 'payment', label: '결제/정산 안내' },
  { value: 'followup', label: '팔로업' },
  { value: 'other', label: '기타' },
];

export default function FreelancerQuestions() {
  const { register, watch, setValue } = useFormContext();
  const selectedTypes = watch('freelancer_messageTypes') || [];
  
  const toggleMessageType = (value: string) => {
    const current = selectedTypes as string[];
    if (current.includes(value)) {
      setValue('freelancer_messageTypes', current.filter((v) => v !== value));
    } else {
      setValue('freelancer_messageTypes', [...current, value]);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          1인 사업자 / 프리랜서 💼
        </h2>
        <p className="text-slate-600">
          업무 상황을 자세히 알려주세요.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          어떤 일을 하시나요? <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('freelancer_job')}
          placeholder="예: 웹 디자이너, 비즈니스 코치, 쇼핑몰 운영"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          가장 시간 많이 드는 업무 3가지 <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('freelancer_timeConsumingTasks')}
          placeholder="예:&#10;1. 고객 문의 답변&#10;2. 견적서 작성&#10;3. SNS 콘텐츠 제작"
          rows={4}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          고객에게 자주 보내는 메시지 유형
        </label>
        <div className="flex flex-wrap gap-2">
          {MESSAGE_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => toggleMessageType(type.value)}
              className={`
                px-4 py-2 rounded-full text-sm transition-all
                ${(selectedTypes as string[]).includes(type.value)
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }
              `}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          최근 고객 응대 상황을 알려주세요
        </label>
        <textarea
          {...register('freelancer_recentClientSituation')}
          placeholder="어떤 문의였나요? 답장 쓰는 데 얼마나 걸렸나요?"
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          AI가 대신해줬으면 하는 업무 1순위
        </label>
        <textarea
          {...register('freelancer_aiWishlist')}
          placeholder="왜 그 업무인지도 함께 알려주세요."
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
    </div>
  );
}
