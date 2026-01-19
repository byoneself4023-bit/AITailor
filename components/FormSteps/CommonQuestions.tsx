'use client';

import { useFormContext } from 'react-hook-form';

const TONE_STYLES = [
  { value: 'formal', label: '격식체', desc: '존댓말, 정중함' },
  { value: 'friendly', label: '친근체', desc: '편안한 느낌' },
  { value: 'concise', label: '간결체', desc: '짧고 핵심만' },
  { value: 'flexible', label: '상황에 따라', desc: '유동적으로' },
];

const AI_LEVELS = [
  { value: 'paid', label: '유료 구독 중', icon: '💳' },
  { value: 'free', label: '무료로 가끔', icon: '🆓' },
  { value: 'rarely', label: '거의 안 씀', icon: '😐' },
  { value: 'never', label: '써본 적 없음', icon: '🤷' },
];

export default function CommonQuestions() {
  const { register, watch, formState: { errors } } = useFormContext();
  const selectedTone = watch('toneStyle');
  const selectedUsage = watch('aiUsageLevel');
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          거의 다 왔어요! 🎉
        </h2>
        <p className="text-slate-600">
          마지막으로 몇 가지만 더 알려주세요.
        </p>
      </div>
      
      {/* 말투 스타일 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          평소 글/말투 스타일 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {TONE_STYLES.map((tone) => (
            <label
              key={tone.value}
              className={`
                flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all text-center
                ${selectedTone === tone.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
                }
              `}
            >
              <input
                type="radio"
                value={tone.value}
                {...register('toneStyle')}
                className="sr-only"
              />
              <span className={`font-medium ${selectedTone === tone.value ? 'text-blue-700' : 'text-slate-800'}`}>
                {tone.label}
              </span>
              <span className="text-xs text-slate-500 mt-1">{tone.desc}</span>
            </label>
          ))}
        </div>
        {errors.toneStyle && (
          <p className="mt-1 text-sm text-red-500">{errors.toneStyle.message as string}</p>
        )}
      </div>
      
      {/* AI 금지사항 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          AI가 하면 안 되는 것 <span className="text-slate-400 text-xs">(선택)</span>
        </label>
        <textarea
          {...register('restrictions')}
          placeholder="예: 이모지 사용 금지, 특정 표현 금지 등"
          rows={2}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
      
      {/* 원하는 결과 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          이 서비스로 얻고 싶은 결과 <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('desiredOutcome')}
          placeholder="예: 고객 응대 시간 50% 단축, 콘텐츠 제작 자동화 등"
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
        {errors.desiredOutcome && (
          <p className="mt-1 text-sm text-red-500">{errors.desiredOutcome.message as string}</p>
        )}
      </div>
      
      {/* AI 사용 수준 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          현재 AI 도구 사용 여부 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {AI_LEVELS.map((level) => (
            <label
              key={level.value}
              className={`
                flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all
                ${selectedUsage === level.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
                }
              `}
            >
              <input
                type="radio"
                value={level.value}
                {...register('aiUsageLevel')}
                className="sr-only"
              />
              <span className="text-xl">{level.icon}</span>
              <span className={`text-sm ${selectedUsage === level.value ? 'text-blue-700 font-medium' : 'text-slate-700'}`}>
                {level.label}
              </span>
            </label>
          ))}
        </div>
        {errors.aiUsageLevel && (
          <p className="mt-1 text-sm text-red-500">{errors.aiUsageLevel.message as string}</p>
        )}
      </div>
      
      {/* 추가 사항 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          추가 전달사항 <span className="text-slate-400 text-xs">(선택)</span>
        </label>
        <textarea
          {...register('additionalNotes')}
          placeholder="궁금한 점, 특별히 고려해야 할 사항 등"
          rows={2}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
    </div>
  );
}
