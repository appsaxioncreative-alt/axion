import { db } from '@/lib/firebase-admin';
import { requireAdmin, deny } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const snap = await db().collection('projects').orderBy('createdAt', 'desc').get();
  return Response.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function POST(req) {
  if (!(await requireAdmin(req))) return deny();
  const b = await req.json();
  if (!b.title || !b.url) return Response.json({ error: 'Title and link are required' }, { status: 400 });
  const doc = {
    title: String(b.title).slice(0, 80),
    description: String(b.description || '').slice(0, 300),
    url: String(b.url).slice(0, 300),
    category: String(b.category || '').slice(0, 40),
    tags: Array.isArray(b.tags) ? b.tags.slice(0, 5).map((t) => String(t).slice(0, 24)) : [],
    createdAt: Date.now(),
  };
  const ref = await db().collection('projects').add(doc);
  return Response.json({ id: ref.id, ...doc });
}
