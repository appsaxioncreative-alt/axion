import { db, adminAuth } from '@/lib/firebase-admin';
import { requireAdmin, deny } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  if (!(await requireAdmin(req))) return deny();
  const snap = await db().collection('clients').get();
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  list.sort((a, b) => b.createdAt - a.createdAt);
  return Response.json(list);
}

export async function POST(req) {
  if (!(await requireAdmin(req))) return deny();
  const { name, email, company, password } = await req.json();
  if (!name || !email || !password || password.length < 6)
    return Response.json({ error: 'Name, email and a password of 6+ characters are required' }, { status: 400 });
  try {
    const user = await adminAuth().createUser({ email, password, displayName: name });
    const doc = { name, email, company: company || '', createdAt: Date.now() };
    await db().collection('clients').doc(user.uid).set(doc);
    return Response.json({ id: user.uid, ...doc });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 });
  }
}
