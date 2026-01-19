'use client';

import { useFormContext } from 'react-hook-form';

const USER_TYPES = [
  {
    value: 'freelancer',
    label: '1인 사업자 / 프리랜서',
    description: '혼자서 사업을 운영하거나 프리랜서로 활동 중',
    icon: '💼',
  },
  {
    value: 'startup',
    label: '스타트업 대표',
    description: '팀을 이끌며 스타트업을 운영 중',
    icon: '🚀',
  },
  {
    value: 'marketer',
    label: '마케터',
    description: '기업 또는 에이전시에서 마케팅 담당',
    icon: '📱',
  },
  {
    value: 'professional',
    label: '전문직',
    description: '변호사, 의사, 회계사 등 전문 분야 종사',
    icon: '⚖️',
  },
  {
    value: 'other',
    label: '기타',
    description: '위 유형에 해당하지 않음',
    icon: '✨',
  },
];

export default function UserTypeStep() {
  const { register, watch, formState: { errors } } = useFormContext();
  const selectedType = watch('userType');
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          어떤 유형에 해당하시나요?
        </h2>
        <p className="text-slate-600">
          맞춤 질문을 드리기 위해 확인이 필요해요.
        </p>
      </div>
      
      <div className="space-y-3">
        {USER_TYPES.map((type) => (
          <label
            key={type.value}
            className={`
              flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all
              ${selectedType === type.value 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-slate-200 hover:border-slate-300'
              }
            `}
          >
            <input
              type="radio"
              value={type.value}
              {...register('userType')}
              className="sr-only"
            />
            <span className="text-2xl">{type.icon}</span>
            <div className="flex-1">
              <p className={`font-medium ${selectedType === type.value ? 'text-blue-700' : 'text-slate-800'}`}>
                {type.label}
              </p>
              <p className="text-sm text-slate-500 mt-0.5">
                {type.description}
              </p>
            </div>
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1
              ${selectedType === type.value 
                ? 'border-blue-500 bg-blue-500' 
                : 'border-slate-300'
              }
            `}>
              {selectedType === type.value && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
          </label>
        ))}
      </div>
      
      {errors.userType && (
        <p className="text-sm text-red-500">{errors.userType.message as string}</p>
      )}
    </div>
  );
}
