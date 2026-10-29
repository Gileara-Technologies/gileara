// Admin layout - server component that checks auth
import { isAllowedContentEditorEmail } from '@/lib/portal/session';
import { requireAdminSession } from './session-guard';
import AdminShell from './AdminShell';

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
  const isContentEditor = isAllowedContentEditorEmail(payload.email);

  return (
    <AdminShell email={payload.email} isContentEditor={isContentEditor}>
      {children}
    </AdminShell>
  );
}
