import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

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
    
    // 유형별 답변 정리
    let typeAnswers = {};
    
    switch (data.userType) {
      case 'freelancer':
        typeAnswers = {
          job: data.freelancer_job,
          timeConsumingTasks: data.freelancer_timeConsumingTasks,
          messageTypes: data.freelancer_messageTypes,
          recentClientSituation: data.freelancer_recentClientSituation,
          aiWishlist: data.freelancer_aiWishlist,
        };
        break;
      case 'startup':
        typeAnswers = {
          companyIntro: data.startup_companyIntro,
          teamSize: data.startup_teamSize,
          communicationChannels: data.startup_communicationChannels,
          repetitiveExplanations: data.startup_repetitiveExplanations,
          longestEmailSituation: data.startup_longestEmailSituation,
          aiWishlist: data.startup_aiWishlist,
        };
        break;
      case 'marketer':
        typeAnswers = {
          brandName: data.marketer_brandName,
          channels: data.marketer_channels,
          contentVolume: data.marketer_contentVolume,
          mostTimeConsumingContent: data.marketer_mostTimeConsumingContent,
          contentCreationProcess: data.marketer_contentCreationProcess,
          successfulContentLink: data.marketer_successfulContentLink,
        };
        break;
      case 'professional':
        typeAnswers = {
          specialty: data.professional_specialty,
          clientType: data.professional_clientType,
          documentTypes: data.professional_documentTypes,
          repetitiveExplanations: data.professional_repetitiveExplanations,
          recentDocumentSituation: data.professional_recentDocumentSituation,
          industryTerms: data.professional_industryTerms,
        };
        break;
    }
    
    // Supabase에 저장
    const { error } = await supabase.from('intake_submissions').insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      user_type: data.userType,
      type_answers: typeAnswers,
      tone_style: data.toneStyle,
      restrictions: data.restrictions || null,
      desired_outcome: data.desiredOutcome,
      ai_usage_level: data.aiUsageLevel,
      additional_notes: data.additionalNotes || null,
    });
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Database error');
    }

    // 관리자 이메일 알림 발송
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && process.env.RESEND_API_KEY) {
      try {
        const submittedAt = new Date().toLocaleString('ko-KR', {
          timeZone: 'Asia/Seoul',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'AI Tailor <onboarding@resend.dev>',
          to: adminEmail,
          subject: `[AI Tailor] 새 상담 신청 - ${data.name}님`,
          html: `
            <div style="font-family: 'Apple SD Gothic Neo', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1a1a1a; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">
                새로운 상담 신청이 접수되었습니다
              </h2>

              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">이름</td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">이메일</td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee;">${data.email}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">연락처</td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee;">${data.phone || '미입력'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">유형</td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee;">${USER_TYPE_LABELS[data.userType] || data.userType}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">신청 시간</td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee;">${submittedAt}</td>
                </tr>
              </table>

              <p style="margin-top: 20px; color: #666; font-size: 14px;">
                관리자 대시보드에서 상세 내용을 확인하세요.
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Admin email notification failed:', emailError);
        // 이메일 실패해도 신청은 성공으로 처리
      }
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
