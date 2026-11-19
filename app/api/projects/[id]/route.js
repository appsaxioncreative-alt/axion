import { db } from '@/lib/firebase-admin';
import { requireAdmin, deny } from '@/lib/auth-server';

export async function DELETE(req, { params }) {
  if (!(await requireAdmin(req))) return deny();
  await db().collection('projects').doc(params.id).delete();
  return Response.json({ ok: true });
}
