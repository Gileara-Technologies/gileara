// Admin layout - server component that checks auth
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { readSessionToken } from '@/lib/portal/session';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;
  const sessionSecret = process.env.SESSION_KEY;

  if (!sessionSecret) {
    redirect('/admin/login');
  }

  if (!sessionToken) {
    redirect('/admin/login');
  }

  const payload = await readSessionToken(sessionToken, sessionSecret);
  if (!payload) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="border-b border-surface-container-high bg-surface/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Admin Portal</h1>
            <span className="text-sm text-on-surface-variant">Signed in as {payload.email}</span>
          </div>
          <Link
            href="/admin/logout"
            className="text-sm text-on-surface-variant hover:text-on-background transition-colors"
          >
            Sign out
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
