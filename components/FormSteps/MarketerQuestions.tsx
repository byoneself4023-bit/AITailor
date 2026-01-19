'use client';

import { useFormContext } from 'react-hook-form';

const CHANNELS = [
  { value: 'instagram', label: '인스타그램' },
  { value: 'facebook', label: '페이스북' },
  { value: 'blog', label: '블로그/SEO' },
  { value: 'youtube', label: '유튜브' },
  { value: 'newsletter', label: '뉴스레터' },
  { value: 'ads', label: '유료 광고' },
];

const VOLUMES = [
  { value: '1-2', label: '1~2개' },
  { value: '3-5', label: '3~5개' },
  { value: '6-10', label: '6~10개' },
  { value: '10+', label: '10개 이상' },
];

export default function MarketerQuestions() {
  const { register, watch, setValue } = useFormContext();
  const selectedChannels = watch('marketer_channels') || [];
  
  const toggleChannel = (value: string) => {
    const current = selectedChannels as string[];
    if (current.includes(value)) {
      setValue('marketer_channels', current.filter((v) => v !== value));
    } else {
      setValue('marketer_channels', [...current, value]);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          마케터 📱
        </h2>
        <p className="text-slate-600">
          마케팅 업무 상황을 알려주세요.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          회사/브랜드명 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('marketer_brandName')}
          placeholder="예: AI Tailor"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          담당 마케팅 채널
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
          주간 콘텐츠 제작량
        </label>
        <div className="grid grid-cols-2 gap-3">
          {VOLUMES.map((vol) => (
            <label
              key={vol.value}
              className={`
                flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all
                ${watch('marketer_contentVolume') === vol.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:border-slate-300'
                }
              `}
            >
              <input
                type="radio"
                value={vol.value}
                {...register('marketer_contentVolume')}
                className="sr-only"
              />
              {vol.label}
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          가장 시간 많이 드는 콘텐츠 작업
        </label>
        <textarea
          {...register('marketer_mostTimeConsumingContent')}
          placeholder="어떤 콘텐츠가 가장 힘든지 알려주세요."
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          콘텐츠 제작 과정을 알려주세요
        </label>
        <textarea
          {...register('marketer_contentCreationProcess')}
          placeholder="아이디어 → 초안 → 수정 → 발행까지 어떻게 진행하시나요?"
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          잘 됐던 콘텐츠 링크 <span className="text-slate-400 text-xs">(선택)</span>
        </label>
        <input
          type="url"
          {...register('marketer_successfulContentLink')}
          placeholder="https://"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>
    </div>
  );
}
