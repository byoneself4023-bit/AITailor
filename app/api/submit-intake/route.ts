import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
