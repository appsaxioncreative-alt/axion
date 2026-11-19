import { db } from '@/lib/firebase-admin';
import { requireAdmin, deny } from '@/lib/auth-server';

const STATUSES = ['planning', 'design', 'development', 'testing', 'completed'];

export async function PUT(req, { params }) {
  if (!(await requireAdmin(req))) return deny();
  const b = await req.json();
  const patch = { updatedAt: Date.now() };
  if (STATUSES.includes(b.status)) {
    patch.status = b.status;
    if (b.status === 'completed') patch.progress = 100;
  }
  if (b.progress !== undefined && b.status !== 'completed')
    patch.progress = Math.max(0, Math.min(100, Number(b.progress) || 0));
  if (b.name) patch.name = String(b.name).slice(0, 80);
  if (b.description !== undefined) patch.description = String(b.description).slice(0, 500);
  await db().collection('clientProjects').doc(params.id).update(patch);
  return Response.json({ ok: true });
}

export async function DELETE(req, { params }) {
  if (!(await requireAdmin(req))) return deny();
  await db().collection('clientProjects').doc(params.id).delete();
  return Response.json({ ok: true });
}
