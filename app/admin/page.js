'use client';
import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { api } from '@/lib/api';
import LoginForm from '@/components/LoginForm';

const STATUSES = ['planning', 'design', 'development', 'testing', 'completed'];
const fmt = (t) => new Date(t).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

export default function AdminPage() {
  const [state, setState] = useState('loading'); // loading | out | in
  const [error, setError] = useState('');

  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        if (!u) return setState('out');
        try {
          await api('/api/admin/me');
          setError('');
          setState('in');
        } catch {
          await signOut(auth);
          setError('This account does not have admin access.');
          setState('out');
        }
      }),
    []
  );

  if (state === 'loading') return <main className="login-wrap"><p className="muted">Loading…</p></main>;
  if (state === 'out')
    return <LoginForm title="Admin sign in" hint="You will be asked to sign in again every time this page loads." memoryOnly error={error} />;
  return <Dashboard />;
}

function Dashboard() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [demos, setDemos] = useState([]);
  const [clients, setClients] = useState([]);
  const [cps, setCps] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    try {
      const [s, d, c, p, m] = await Promise.all([
        api('/api/admin/stats'), api('/api/projects'), api('/api/admin/clients'),
        api('/api/admin/client-projects'), api('/api/admin/messages'),
      ]);
      setStats(s); setDemos(d); setClients(c); setCps(p); setMsgs(m);
    } catch (e) { setErr(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const run = async (fn) => { setErr(''); try { await fn(); await load(); return true; } catch (e) { setErr(e.message); return false; } };
  const tabs = [
    ['overview', 'Overview'], ['demos', 'Demo projects'], ['clients', 'Clients'],
    ['cprojects', 'Client projects'], ['messages', `Messages${stats?.unreadMessages ? ` (${stats.unreadMessages})` : ''}`],
  ];

  return (
    <div className="admin">
      <aside>
        <a className="logo" href="/">Axion<span>Creatives</span></a>
        {tabs.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
        <button className="signout" onClick={() => signOut(auth)}>Sign out</button>
      </aside>
      <section>
        {err && <p className="err">{err}</p>}
        {tab === 'overview' && <Overview stats={stats} refresh={load} />}
        {tab === 'demos' && <Demos demos={demos} stats={stats} run={run} />}
        {tab === 'clients' && <Clients clients={clients} run={run} />}
        {tab === 'cprojects' && <ClientProjects clients={clients} cps={cps} run={run} />}
        {tab === 'messages' && <Messages msgs={msgs} run={run} />}
      </section>
    </div>
  );
}

function Overview({ stats, refresh }) {
  if (!stats) return <p className="muted">Loading…</p>;
  const rows = Object.values(stats.clicksByProject).sort((a, b) => b.count - a.count);
  return (
    <>
      <div className="head"><h2>Overview</h2><button className="btn" onClick={refresh}>Refresh</button></div>
      <div className="kpis">
        <div><strong>{stats.views}</strong><span>Page views</span></div>
        <div><strong>{stats.visitors}</strong><span>Unique visitors</span></div>
        <div><strong>{stats.clicks}</strong><span>Demo clicks</span></div>
        <div><strong>{stats.unreadMessages}</strong><span>Unread messages</span></div>
      </div>
      <h3>Clicks per demo</h3>
      <div className="panel">
        {rows.length ? rows.map((r) => <div className="row" key={r.label}><span>{r.label}</span><b>{r.count}</b></div>) : <p className="muted">No clicks yet.</p>}
      </div>
      <h3>Recent activity</h3>
      <div className="panel">
        {stats.recent.length ? stats.recent.map((e, i) => (
          <div className="row" key={i}>
            <span>{e.type === 'click' ? `Clicked “${e.label}”` : 'Viewed the home page'}</span>
            <small>{fmt(e.ts)}</small>
          </div>
        )) : <p className="muted">No activity yet.</p>}
      </div>
    </>
  );
}

function Demos({ demos, stats, run }) {
  const empty = { title: '', description: '', url: '', category: '', tags: '' };
  const [f, setF] = useState(empty);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const add = async (e) => {
    e.preventDefault();
    const ok = await run(() => api('/api/projects', { method: 'POST', body: { ...f, tags: f.tags.split(',').map((t) => t.trim()).filter(Boolean) } }));
    if (ok) setF(empty);
  };
  return (
    <>
      <h2>Demo projects</h2>
      <form className="panel form" onSubmit={add}>
        <input placeholder="Title" value={f.title} onChange={set('title')} required />
        <input placeholder="Live link (https://…)" value={f.url} onChange={set('url')} required />
        <input placeholder="Category (e.g. Fitness)" value={f.category} onChange={set('category')} />
        <input placeholder="Tags, separated by commas" value={f.tags} onChange={set('tags')} />
        <textarea placeholder="Short description" value={f.description} onChange={set('description')} rows={2} />
        <button className="btn primary">Add demo</button>
      </form>
      <div className="panel">
        {demos.length ? demos.map((d) => (
          <div className="row" key={d.id}>
            <span><b>{d.title}</b><br /><small>{d.url}</small></span>
            <span className="actions-inline">
              <small>{stats?.clicksByProject?.[d.id]?.count || 0} clicks</small>
              <button className="btn danger" onClick={() => confirm(`Delete “${d.title}”?`) && run(() => api(`/api/projects/${d.id}`, { method: 'DELETE' }))}>Delete</button>
            </span>
          </div>
        )) : <p className="muted">No demos yet. Add your first one above.</p>}
      </div>
    </>
  );
}

function Clients({ clients, run }) {
  const empty = { name: '', email: '', company: '', password: '' };
  const [f, setF] = useState(empty);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const add = async (e) => { e.preventDefault(); if (await run(() => api('/api/admin/clients', { method: 'POST', body: f }))) setF(empty); };
  return (
    <>
      <h2>Clients</h2>
      <p className="muted">Clients cannot sign up. Create their login here and share the email and password with them.</p>
      <form className="panel form" onSubmit={add}>
        <input placeholder="Name" value={f.name} onChange={set('name')} required />
        <input placeholder="Company" value={f.company} onChange={set('company')} />
        <input type="email" placeholder="Login email" value={f.email} onChange={set('email')} required />
        <input placeholder="Password (6+ characters)" value={f.password} onChange={set('password')} required minLength={6} />
        <button className="btn primary">Create client login</button>
      </form>
      <div className="panel">
        {clients.length ? clients.map((c) => (
          <div className="row" key={c.id}>
            <span><b>{c.name}</b> {c.company && `· ${c.company}`}<br /><small>{c.email}</small></span>
            <button className="btn danger" onClick={() => confirm(`Delete ${c.name} and all their projects?`) && run(() => api(`/api/admin/clients/${c.id}`, { method: 'DELETE' }))}>Delete</button>
          </div>
        )) : <p className="muted">No clients yet.</p>}
      </div>
    </>
  );
}

function ClientProjects({ clients, cps, run }) {
  const empty = { clientId: '', name: '', description: '', status: 'planning', progress: 0 };
  const [f, setF] = useState(empty);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const add = async (e) => { e.preventDefault(); if (await run(() => api('/api/admin/client-projects', { method: 'POST', body: f }))) setF(empty); };
  const nameOf = (id) => clients.find((c) => c.id === id)?.name || 'Unknown client';
  return (
    <>
      <h2>Client projects</h2>
      <form className="panel form" onSubmit={add}>
        <select value={f.clientId} onChange={set('clientId')} required>
          <option value="">Choose client</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Project name" value={f.name} onChange={set('name')} required />
        <select value={f.status} onChange={set('status')}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <input type="number" min="0" max="100" placeholder="Progress %" value={f.progress} onChange={set('progress')} />
        <textarea placeholder="Description the client will see" value={f.description} onChange={set('description')} rows={2} />
        <button className="btn primary">Add project</button>
      </form>
      <div className="panel">
        {cps.length ? cps.map((p) => (
          <div className="row" key={p.id}>
            <span><b>{p.name}</b><br /><small>{nameOf(p.clientId)} · updated {fmt(p.updatedAt)}</small></span>
            <span className="actions-inline">
              <select value={p.status} onChange={(e) => run(() => api(`/api/admin/client-projects/${p.id}`, { method: 'PUT', body: { status: e.target.value } }))}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <input className="pct" type="number" min="0" max="100" defaultValue={p.progress} disabled={p.status === 'completed'}
                onBlur={(e) => Number(e.target.value) !== p.progress && run(() => api(`/api/admin/client-projects/${p.id}`, { method: 'PUT', body: { progress: e.target.value } }))} />
              <button className="btn danger" onClick={() => confirm('Delete this project?') && run(() => api(`/api/admin/client-projects/${p.id}`, { method: 'DELETE' }))}>Delete</button>
            </span>
          </div>
        )) : <p className="muted">No client projects yet.</p>}
      </div>
    </>
  );
}

function Messages({ msgs, run }) {
  return (
    <>
      <h2>Messages</h2>
      <div className="panel">
        {msgs.length ? msgs.map((m) => (
          <div className={`msg ${m.read ? '' : 'unread'}`} key={m.id}>
            <div className="row"><span><b>{m.clientName}</b> · {m.projectName}</span><small>{fmt(m.createdAt)}</small></div>
            <p>{m.text}</p>
            <small>{m.clientEmail}</small>
            {!m.read && <button className="btn" onClick={() => run(() => api('/api/admin/messages', { method: 'PUT', body: { id: m.id } }))}>Mark as read</button>}
          </div>
        )) : <p className="muted">No messages yet.</p>}
      </div>
    </>
  );
}
