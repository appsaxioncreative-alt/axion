import { db } from '@/lib/firebase-admin';
import { requireAdmin, deny } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  if (!(await requireAdmin(req))) return deny();
  const snap = await db().collection('messages').orderBy('createdAt', 'desc').limit(200).get();
  return Response.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function PUT(req) {
  if (!(await requireAdmin(req))) return deny();
  const { id } = await req.json();
  await db().collection('messages').doc(id).update({ read: true });
  return Response.json({ ok: true });
}
