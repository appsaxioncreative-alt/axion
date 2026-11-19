import { adminAuth } from './firebase-admin';

export async function verifyUser(req) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '');
  if (!token) return null;
  try {
    return await adminAuth().verifyIdToken(token);
  } catch {
    return null;
  }
}

export async function requireAdmin(req) {
  const user = await verifyUser(req);
  const admin = (process.env.ADMIN_EMAIL || '').toLowerCase();
  if (!user || !admin || (user.email || '').toLowerCase() !== admin) return null;
  return user;
}

export const deny = () =>
  Response.json({ error: 'Not allowed' }, { status: 403 });
