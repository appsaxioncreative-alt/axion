import { db } from '@/lib/firebase-admin';

export async function POST(req) {
  try {
    const b = await req.json();
    if (!['view', 'click'].includes(b.type)) return Response.json({ ok: false }, { status: 400 });
    await db().collection('events').add({
      type: b.type,
      projectId: String(b.projectId || '').slice(0, 60),
      label: String(b.label || '').slice(0, 80),
      vid: String(b.vid || '').slice(0, 40),
      ref: String(b.ref || '').slice(0, 120),
      ua: (req.headers.get('user-agent') || '').slice(0, 120),
      ts: Date.now(),
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
