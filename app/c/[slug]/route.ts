import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const res = await fetch(
      `https://api-shamel.tmt3.sa/api/v1/marketer-campaigns/${slug}`,
      { cache: 'no-store' }
    );

    if (res.ok) {
      const data = await res.json();

      if (data.success) {
        const redirectUrl = new URL(
          `/m/${data.project_id}`,
          request.url
        );

        const response = NextResponse.redirect(redirectUrl);

        response.cookies.set({
          name: 'marketer_campaign_id',
          value: data.marketer_campaign_id,
          maxAge: 30 * 24 * 60 * 60, // 30 يوم
          path: '/',
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });

        return response;
      }
    }
  } catch (error) {
    console.error('Affiliate tracking error:', error);
  }

  // خط الدفاع: أي مشكلة → الرئيسية
  return NextResponse.redirect(new URL('/', request.url));
}