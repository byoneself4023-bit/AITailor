import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* 로고/브랜드 */}
          <div className="mb-8">
            <span className="text-5xl">✂️</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            당신만을 위한<br />
            <span className="text-blue-600">AI 맞춤 설정</span> 서비스
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            커스텀 GPT, 시스템 프롬프트, 업무 자동화까지<br />
            바쁜 당신 대신 AI를 완벽하게 세팅해 드립니다.
          </p>
          
          <Link 
            href="/intake"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-xl hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/25"
          >
            무료 상담 신청하기 →
          </Link>
          
          <p className="mt-4 text-sm text-slate-500">
            5분이면 신청 완료 · 1~2일 내 연락
          </p>
        </div>
      </section>
      
      {/* 문제 제기 섹션 */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-12">
            이런 고민 있으신가요?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { emoji: '😰', text: 'ChatGPT 유료 결제했는데 제대로 활용을 못하고 있어요' },
              { emoji: '🤔', text: '커스텀 GPT, 프롬프트... 뭐가 뭔지 모르겠어요' },
              { emoji: '⏰', text: '설정하고 배울 시간이 없어요, 누가 대신 해줬으면...' },
              { emoji: '📝', text: '매번 같은 내용 복붙하는데 자동화하고 싶어요' },
            ].map((item, i) => (
              <div 
                key={i}
                className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl"
              >
                <span className="text-2xl">{item.emoji}</span>
                <p className="text-slate-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 서비스 소개 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-4">
            AI Tailor가 해결해 드립니다
          </h2>
          <p className="text-center text-slate-600 mb-12">
            양복점에서 맞춤 정장을 만들듯, AI를 당신에게 딱 맞게 세팅해 드려요.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: '상담 & 분석',
                desc: '업무 방식, 말투, 목표를 파악합니다',
                icon: '🎯',
              },
              {
                step: '02',
                title: '맞춤 구축',
                desc: '프롬프트, 커스텀 GPT, SOP를 만들어 드립니다',
                icon: '⚙️',
              },
              {
                step: '03',
                title: '설치 & 교육',
                desc: '계정에 설치하고 사용법을 알려드립니다',
                icon: '🚀',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-sm text-blue-600 font-medium mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 대상 고객 섹션 */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-12">
            이런 분들께 추천합니다
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: '1인 사업자 / 프리랜서', desc: '혼자서 고객 응대, 콘텐츠, 제안서까지 하시는 분', icon: '💼' },
              { title: '스타트업 대표', desc: '빠른 의사결정과 효율적인 커뮤니케이션이 필요한 분', icon: '🚀' },
              { title: '마케터', desc: '콘텐츠 제작에 시간을 많이 쓰시는 분', icon: '📱' },
              { title: '전문직', desc: '문서 작성과 고객 상담이 많은 변호사, 의사, 회계사', icon: '⚖️' },
            ].map((item, i) => (
              <div 
                key={i}
                className="flex items-start gap-4 p-6 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
            AI, 이제 제대로 활용해보세요
          </h2>
          <p className="text-slate-600 mb-8">
            5분만 투자하시면, 맞춤 견적과 제안서를 보내드립니다.
          </p>
          
          <Link 
            href="/intake"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-xl hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/25"
          >
            무료 상담 신청하기 →
          </Link>
        </div>
      </section>
      
      {/* 푸터 */}
      <footer className="py-8 px-4 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center text-sm text-slate-500">
          <p>© 2025 AI Tailor. All rights reserved.</p>
          <p className="mt-2">
            문의: <a href="mailto:byoneself4023@ajou.ac.kr" className="text-blue-600 hover:underline">byoneself4023@ajou.ac.kr</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
