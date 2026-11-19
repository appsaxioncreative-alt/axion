import { requireAdmin, deny } from '@/lib/auth-server';

export async function GET(req) {
  const u = await requireAdmin(req);
  return u ? Response.json({ email: u.email }) : deny();
}
