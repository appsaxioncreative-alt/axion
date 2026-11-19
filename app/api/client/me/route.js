import { db } from '@/lib/firebase-admin';
import { verifyUser, deny } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const u = await verifyUser(req);
  if (!u) return deny();
  const c = await db().collection('clients').doc(u.uid).get();
  if (!c.exists) return deny(); // only accounts created by admin are clients
  const ps = await db().collection('clientProjects').where('clientId', '==', u.uid).get();
  const projects = ps.docs.map((d) => ({ id: d.id, ...d.data() }));
  projects.sort((a, b) => b.updatedAt - a.updatedAt);
  return Response.json({ client: { id: c.id, ...c.data() }, projects });
}
