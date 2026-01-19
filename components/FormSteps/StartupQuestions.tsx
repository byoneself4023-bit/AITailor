'use client';

import { useFormContext } from 'react-hook-form';

const CHANNELS = [
  { value: 'email', label: '이메일' },
  { value: 'slack', label: '슬랙/팀즈' },
  { value: 'meeting', label: '미팅/화상회의' },
  { value: 'kakao', label: '카카오톡' },
  { value: 'other', label: '기타' },
];

export default function StartupQuestions() {
  const { register, watch, setValue } = useFormContext();
  const selectedChannels = watch('startup_communicationChannels') || [];
  
  const toggleChannel = (value: string) => {
    const current = selectedChannels as string[];
    if (current.includes(value)) {
      setValue('startup_communicationChannels', current.filter((v) => v !== value));
    } else {
      setValue('startup_communicationChannels', [...current, value]);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          스타트업 대표 🚀
        </h2>
        <p className="text-slate-600">
          회사와 업무 상황을 알려주세요.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          회사가 하는 일 (한 줄) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('startup_companyIntro')}
          placeholder="예: B2B SaaS 마케팅 자동화 솔루션"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          팀 규모 (본인 포함) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('startup_teamSize')}
          placeholder="예: 5명"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          주로 사용하는 커뮤니케이션 채널
        </label>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map((channel) => (
            <button
              key={channel.value}
              type="button"
              onClick={() => toggleChannel(channel.value)}
              className={`
                px-4 py-2 rounded-full text-sm transition-all
                ${(selectedChannels as string[]).includes(channel.value)
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }
              `}
            >
              {channel.label}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          반복적으로 설명하는 내용이 있다면?
        </label>
        <textarea
          {...register('startup_repetitiveExplanations')}
          placeholder="예: 회사 소개, 제품 설명, 협업 방식 등"
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          가장 오래 걸린 이메일/메시지 상황
        </label>
        <textarea
          {...register('startup_longestEmailSituation')}
          placeholder="누구에게 보낸 건가요? 왜 오래 걸렸나요?"
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          AI가 있다면 가장 먼저 맡기고 싶은 일
        </label>
        <textarea
          {...register('startup_aiWishlist')}
          placeholder="구체적으로 어떤 상황에서 도움받고 싶은지 알려주세요."
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
    </div>
  );
}
