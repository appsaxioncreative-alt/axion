import { db } from '@/lib/firebase-admin';
import { verifyUser, deny } from '@/lib/auth-server';

export async function POST(req) {
  const u = await verifyUser(req);
  if (!u) return deny();
  const { projectId, text } = await req.json();
  if (!text || !text.trim()) return Response.json({ error: 'Write a message first' }, { status: 400 });
  const p = await db().collection('clientProjects').doc(String(projectId)).get();
  if (!p.exists || p.data().clientId !== u.uid) return deny();
  if (p.data().status !== 'completed')
    return Response.json({ error: 'You can request service once the project is completed' }, { status: 400 });
  const c = await db().collection('clients').doc(u.uid).get();
  await db().collection('messages').add({
    clientId: u.uid,
    clientName: c.exists ? c.data().name : '',
    clientEmail: u.email || '',
    projectId,
    projectName: p.data().name,
    text: text.trim().slice(0, 1500),
    read: false,
    createdAt: Date.now(),
  });
  return Response.json({ ok: true });
}
