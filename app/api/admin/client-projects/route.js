import { db } from '@/lib/firebase-admin';
import { requireAdmin, deny } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';
const STATUSES = ['planning', 'design', 'development', 'testing', 'completed'];

export async function GET(req) {
  if (!(await requireAdmin(req))) return deny();
  const snap = await db().collection('clientProjects').get();
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  list.sort((a, b) => b.updatedAt - a.updatedAt);
  return Response.json(list);
}

export async function POST(req) {
  if (!(await requireAdmin(req))) return deny();
  const b = await req.json();
  if (!b.clientId || !b.name) return Response.json({ error: 'Client and project name are required' }, { status: 400 });
  const doc = {
    clientId: b.clientId,
    name: String(b.name).slice(0, 80),
    description: String(b.description || '').slice(0, 500),
    status: STATUSES.includes(b.status) ? b.status : 'planning',
    progress: Math.max(0, Math.min(100, Number(b.progress) || 0)),
    updatedAt: Date.now(),
  };
  const ref = await db().collection('clientProjects').add(doc);
  return Response.json({ id: ref.id, ...doc });
}
