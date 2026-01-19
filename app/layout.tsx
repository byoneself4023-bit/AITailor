import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Tailor - 당신만을 위한 AI 맞춤 설정',
  description: '바쁜 당신을 위해 AI 시스템을 맞춤 설정해 드립니다. 커스텀 GPT, 시스템 프롬프트, 업무 자동화까지.',
  keywords: ['AI', '맞춤 설정', 'ChatGPT', '프롬프트', '업무 자동화', 'AI 대행'],
  authors: [{ name: 'AI Tailor' }],
  openGraph: {
    title: 'AI Tailor - 당신만을 위한 AI 맞춤 설정',
    description: '바쁜 당신을 위해 AI 시스템을 맞춤 설정해 드립니다.',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
