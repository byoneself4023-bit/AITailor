'use client';

import { useFormContext } from 'react-hook-form';

export default function BasicInfoStep() {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          안녕하세요! 👋
        </h2>
        <p className="text-slate-600">
          먼저 기본 정보를 알려주세요.
        </p>
      </div>
      
      {/* 이름 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          이름 (또는 닉네임) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('name')}
          placeholder="홍길동"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message as string}</p>
        )}
      </div>
      
      {/* 이메일 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          이메일 주소 <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          {...register('email')}
          placeholder="hello@example.com"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message as string}</p>
        )}
      </div>
      
      {/* 연락처 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          연락처 <span className="text-slate-400 text-xs">(선택)</span>
        </label>
        <input
          type="tel"
          {...register('phone')}
          placeholder="010-1234-5678"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>
    </div>
  );
}
