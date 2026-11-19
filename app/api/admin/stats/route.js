import { db } from '@/lib/firebase-admin';
import { requireAdmin, deny } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  if (!(await requireAdmin(req))) return deny();
  const snap = await db().collection('events').orderBy('ts', 'desc').limit(2000).get();
  const events = snap.docs.map((d) => d.data());
  const clicksByProject = {};
  const visitors = new Set();
  let views = 0, clicks = 0;
  for (const e of events) {
    if (e.vid) visitors.add(e.vid);
    if (e.type === 'view') views++;
    if (e.type === 'click') {
      clicks++;
      const k = e.projectId || e.label;
      clicksByProject[k] = clicksByProject[k] || { label: e.label, count: 0 };
      clicksByProject[k].count++;
    }
  }
  const msgs = await db().collection('messages').where('read', '==', false).get();
  return Response.json({
    views, clicks, visitors: visitors.size, unreadMessages: msgs.size,
    clicksByProject,
    recent: events.slice(0, 40),
  });
}
