// Admin layout - server component that checks auth
import { requireAdminSession } from './session-guard';
import { logoutAction } from './logout/action';

export const metadata = {
  title: 'Admin Portal - Gileara',
  // Auth-only area: never index, and don't pass link equity through it.
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const payload = await requireAdminSession();

  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="border-b border-surface-container-high bg-surface/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Admin Portal</h1>
            <span className="text-sm text-on-surface-variant">Signed in as {payload.email}</span>
          </div>
          {/*
            POST form instead of <Link href="/admin/logout">: Next.js prefetches
            visible links in production, and prefetching a stateful GET logged
            the admin out as soon as the dashboard rendered.
          */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-on-surface-variant hover:text-on-background transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
