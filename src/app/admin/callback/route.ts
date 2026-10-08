// Admin OAuth callback
// Exchanges code for tokens, validates user, creates session

import { NextRequest, NextResponse } from 'next/server';
import { isAllowedHrEmail, createSessionPayload, createSessionToken } from '@/lib/portal/session';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Check for OAuth errors
  if (error) {
    return NextResponse.redirect(new URL('/admin/login?error=denied', request.url));
  }

  // Validate state
  const storedState = request.cookies.get('oauth_state')?.value;
  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL('/admin/login?error=denied', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/admin/login?error=denied', request.url));
  }

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_OAUTH_REDIRECT_URI || 'https://gileara.org/admin/callback';
  const sessionSecret = process.env.SESSION_KEY;
  const hrEmails = process.env.HR_EMAILS;

  if (!clientId || !clientSecret || !sessionSecret) {
    return NextResponse.redirect(new URL('/admin/login?error=denied', request.url));
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    });

    if (!tokenResponse.ok) {
      return NextResponse.redirect(new URL('/admin/login?error=denied', request.url));
    }

    const tokenData = (await tokenResponse.json()) as {
      access_token: string;
      id_token?: string;
    };

    // Get user info from Google
    const userResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(new URL('/admin/login?error=denied', request.url));
    }

    const userData = (await userResponse.json()) as {
      email?: string;
      email_verified?: boolean;
      name?: string;
    };

    // Check if email is allowed (and Google considers it verified)
    if (!userData.email || userData.email_verified === false) {
      return NextResponse.redirect(new URL('/admin/login?error=denied', request.url));
    }
    if (!isAllowedHrEmail(userData.email, hrEmails)) {
      return NextResponse.redirect(new URL('/admin/login?error=denied', request.url));
    }

    // Create session
    const sessionPayload = createSessionPayload(userData.email);
    const sessionToken = await createSessionToken(sessionPayload, sessionSecret);

    // Create response with session cookie
    const response = NextResponse.redirect(new URL('/admin', request.url));
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    // Clear state cookie
    response.cookies.delete('oauth_state');

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/admin/login?error=denied', request.url));
  }
}
