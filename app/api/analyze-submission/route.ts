import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const resend = new Resend(process.env.RESEND_API_KEY);

const USER_TYPE_LABELS: Record<string, string> = {
  freelancer: '1인 사업자/프리랜서',
  startup: '스타트업 대표',
  marketer: '마케터',
  professional: '전문직',
  other: '기타',
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 유형별 정보 추출
    let typeSpecificInfo = '';
    switch (data.userType) {
      case 'freelancer':
        typeSpecificInfo = `
직업: ${data.freelancer_job || '미입력'}
시간 소모 업무: ${data.freelancer_timeConsumingTasks || '미입력'}
자주 보내는 메시지: ${data.freelancer_messageTypes?.join(', ') || '미입력'}
최근 고객 응대 상황: ${data.freelancer_recentClientSituation || '미입력'}
AI가 대신했으면 하는 업무: ${data.freelancer_aiWishlist || '미입력'}`;
        break;
      case 'startup':
        typeSpecificInfo = `
회사/서비스: ${data.startup_companyIntro || '미입력'}
팀 규모: ${data.startup_teamSize || '미입력'}
커뮤니케이션 채널: ${data.startup_communicationChannels?.join(', ') || '미입력'}
반복 설명 내용: ${data.startup_repetitiveExplanations || '미입력'}
가장 오래 걸린 이메일: ${data.startup_longestEmailSituation || '미입력'}`;
        break;
      case 'marketer':
        typeSpecificInfo = `
브랜드명: ${data.marketer_brandName || '미입력'}
담당 채널: ${data.marketer_channels?.join(', ') || '미입력'}
월 콘텐츠량: ${data.marketer_contentVolume || '미입력'}
시간 많이 드는 콘텐츠: ${data.marketer_mostTimeConsumingContent || '미입력'}`;
        break;
      case 'professional':
        typeSpecificInfo = `
전문 분야: ${data.professional_specialty || '미입력'}
주요 고객층: ${data.professional_clientType || '미입력'}
자주 작성하는 문서: ${data.professional_documentTypes?.join(', ') || '미입력'}
반복 설명 내용: ${data.professional_repetitiveExplanations || '미입력'}`;
        break;
    }

    const prompt = `당신은 AI 자동화 전문 컨설턴트입니다. 다음 고객 정보를 분석하여 맞춤 제안을 작성하세요.

[고객 정보]
이름: ${data.name}
유형: ${USER_TYPE_LABELS[data.userType] || data.userType}
${typeSpecificInfo}

원하는 결과: ${data.desiredOutcome || '미입력'}

[지시사항]
1. 고객의 상황을 2-3문장으로 공감하며 요약하세요. 친근하고 따뜻한 톤으로.
2. AI로 자동화할 수 있는 구체적인 영역 3가지를 제안하세요. 각각에 대해:
   - 자동화 가능한 업무명 (간결하게)
   - 어떻게 도움이 되는지 한 줄 설명

[출력 형식 - 반드시 이 JSON 형식으로만 응답하세요]
{
  "summary": "고객 상황 공감 요약 (2-3문장)",
  "recommendations": [
    { "title": "자동화 영역 1", "description": "한 줄 설명" },
    { "title": "자동화 영역 2", "description": "한 줄 설명" },
    { "title": "자동화 영역 3", "description": "한 줄 설명" }
  ]
}

JSON만 출력하고 다른 텍스트는 포함하지 마세요.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // JSON 파싱 시도
    let analysis;
    try {
      // JSON 블록 추출 (```json ... ``` 형식 처리)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('JSON not found');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw text:', text);
      // 파싱 실패 시 기본 응답
      analysis = {
        summary: `${data.name}님, 반복적인 업무로 바쁜 하루를 보내고 계시는군요. AI 자동화로 더 중요한 일에 집중하실 수 있도록 도와드릴게요.`,
        recommendations: [
          { title: '반복 업무 자동화', description: 'AI가 정형화된 업무를 자동으로 처리해드립니다.' },
          { title: '문서 작성 보조', description: '초안 작성과 편집을 AI가 도와드립니다.' },
          { title: '커뮤니케이션 효율화', description: '메시지 템플릿과 자동 응답을 설정해드립니다.' },
        ],
      };
    }

    // 고객에게 결과 이메일 발송
    if (data.email && process.env.RESEND_API_KEY) {
      try {
        const recommendationsHtml = analysis.recommendations
          .map(
            (rec: { title: string; description: string }, index: number) => `
            <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
              <div style="font-weight: bold; color: #4f46e5; margin-bottom: 4px;">
                ${index + 1}. ${rec.title}
              </div>
              <div style="color: #666; font-size: 14px;">
                ${rec.description}
              </div>
            </div>
          `
          )
          .join('');

        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'AI Tailor <onboarding@resend.dev>',
          to: data.email,
          subject: `${data.name}님을 위한 AI 자동화 분석 결과`,
          html: `
            <div style="font-family: 'Apple SD Gothic Neo', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1a1a1a; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">
                ${data.name}님을 위한 AI 자동화 분석 결과
              </h2>

              <div style="background: linear-gradient(135deg, #eef2ff, #faf5ff); border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="color: #374151; line-height: 1.6; margin: 0;">
                  ${analysis.summary}
                </p>
              </div>

              <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 16px;">
                추천 자동화 영역
              </h3>

              ${recommendationsHtml}

              <div style="margin-top: 30px; padding: 20px; background: #4f46e5; border-radius: 8px; text-align: center;">
                <p style="color: white; margin: 0 0 12px 0; font-size: 16px;">
                  맞춤 AI 자동화 솔루션이 궁금하시다면?
                </p>
                <a href="mailto:${process.env.ADMIN_EMAIL || ''}" style="display: inline-block; background: white; color: #4f46e5; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                  상담 문의하기
                </a>
              </div>

              <p style="margin-top: 30px; color: #9ca3af; font-size: 12px; text-align: center;">
                이 이메일은 AI Tailor 상담 신청에 의해 자동 발송되었습니다.
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Customer email notification failed:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      analysis,
      name: data.name,
    });

  } catch (error) {
    console.error('Analyze error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', success: false },
      { status: 500 }
    );
  }
}
