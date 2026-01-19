'use client';

import { useFormContext } from 'react-hook-form';

const DOC_TYPES = [
  { value: 'contract', label: '계약서/합의서' },
  { value: 'opinion', label: '의견서/검토서' },
  { value: 'diagnosis', label: '소견서/진단서' },
  { value: 'proposal', label: '제안서/견적서' },
  { value: 'email', label: '이메일/안내문' },
  { value: 'other', label: '기타' },
];

export default function ProfessionalQuestions() {
  const { register, watch, setValue } = useFormContext();
  const selectedTypes = watch('professional_documentTypes') || [];
  
  const toggleType = (value: string) => {
    const current = selectedTypes as string[];
    if (current.includes(value)) {
      setValue('professional_documentTypes', current.filter((v) => v !== value));
    } else {
      setValue('professional_documentTypes', [...current, value]);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          전문직 ⚖️
        </h2>
        <p className="text-slate-600">
          전문 분야와 업무 상황을 알려주세요.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          전문 분야 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('professional_specialty')}
          placeholder="예: 민사/형사, 내과/피부과, 세무/회계"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          주요 클라이언트/환자 유형
        </label>
        <textarea
          {...register('professional_clientType')}
          placeholder="예: 30~40대 직장인, 중소기업 대표 등"
          rows={2}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          자주 작성하는 문서 유형
        </label>
        <div className="flex flex-wrap gap-2">
          {DOC_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => toggleType(type.value)}
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
          반복적으로 설명하는 내용
        </label>
        <textarea
          {...register('professional_repetitiveExplanations')}
          placeholder="예: 절차 안내, 주의사항, 예상 일정 등"
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          최근 작성한 문서 상황
        </label>
        <textarea
          {...register('professional_recentDocumentSituation')}
          placeholder="어떤 케이스였나요? 얼마나 걸렸나요? 반복되는 부분이 있었나요?"
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          AI가 알아야 할 업계 용어/표현
        </label>
        <textarea
          {...register('professional_industryTerms')}
          placeholder="자주 쓰는 전문 용어, 약어 등"
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
    </div>
  );
}
