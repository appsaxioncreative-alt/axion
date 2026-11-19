import { db, adminAuth } from '@/lib/firebase-admin';
import { requireAdmin, deny } from '@/lib/auth-server';

export async function DELETE(req, { params }) {
  if (!(await requireAdmin(req))) return deny();
  const id = params.id;
  try { await adminAuth().deleteUser(id); } catch {}
  const batch = db().batch();
  batch.delete(db().collection('clients').doc(id));
  const ps = await db().collection('clientProjects').where('clientId', '==', id).get();
  ps.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  return Response.json({ ok: true });
}
