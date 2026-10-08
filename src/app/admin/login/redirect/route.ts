// Admin login redirect route - generates OAuth URL and redirects
// This handles the OAuth initiation separately

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const redirectUri =
    process.env.GOOGLE_OAUTH_REDIRECT_URI || 'https://gileara.org/admin/callback';

  if (!clientId) {
    return NextResponse.redirect(new URL('/admin/login?error=denied', request.url));
  }

  // Generate state token (Web Crypto global — works on Workers and Node)
  const state = crypto.randomUUID();

  // Build Google OAuth URL
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', state);

  // Create response with redirect and set state cookie
  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10, // 10 minutes
  });

  return response;
}
