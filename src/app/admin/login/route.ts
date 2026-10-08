// Admin login route
// Renders a simple login page with Google sign-in button.
// Route handler (not a page) deliberately: the /admin layout guard would
// redirect an unauthenticated /admin/login page into a loop, and layouts
// do not apply to route handlers.
// Self-contained HTML + inline CSS — no Tailwind Play CDN in production.

import { NextRequest, NextResponse } from 'next/server';

const pageStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0a0f1a;
    color: #f8fafc;
    font-family: Inter, system-ui, -apple-system, sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
  .card {
    max-width: 26rem;
    width: 100%;
    background: #0f1729;
    border: 1px solid #1e293b;
    border-radius: 0.75rem;
    padding: 2rem;
  }
  .card h1 { font-size: 1.5rem; font-weight: 600; text-align: center; }
  .card .sub {
    color: #94a3b8;
    font-size: 0.875rem;
    text-align: center;
    margin-top: 0.5rem;
  }
  .error {
    margin-top: 1.5rem;
    padding: 1rem;
    background: rgba(127, 29, 29, 0.25);
    border: 1px solid #991b1b;
    border-radius: 0.5rem;
    color: #fecaca;
    font-size: 0.875rem;
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
    margin-top: 1.5rem;
    background: #ffffff;
    color: #000000;
    border: none;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }
  .btn:hover { background: #e2e8f0; }
  .home {
    display: block;
    margin-top: 1.5rem;
    text-align: center;
    color: #94a3b8;
    font-size: 0.875rem;
    text-decoration: none;
  }
  .home:hover { color: #f8fafc; }
`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');

  const errorBanner =
    error === 'denied'
      ? `<p class="error">Access denied. Your email is not authorized.</p>`
      : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Admin Sign In - Gileara</title>
  <style>${pageStyles}</style>
</head>
<body>
  <main class="card">
    <h1>Admin Sign In</h1>
    <p class="sub">Access the careers portal admin</p>
    ${errorBanner}
    <form method="GET" action="/admin/login/redirect">
      <button
        type="submit"
        class="btn"
        aria-label="Sign in with Google"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </svg>
        Sign in with Google
      </button>
    </form>
    <a class="home" href="/">Return to homepage</a>
  </main>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      // Auth surface: layouts do not apply to route handlers, so the
      // noindex that lives in admin/layout.tsx metadata never reaches
      // this route. Send it the way route handlers can: headers.
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
