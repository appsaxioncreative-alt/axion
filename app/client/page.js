'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { api } from '@/lib/api';
import LoginForm from '@/components/LoginForm';

const LABEL = { planning: 'Planning', design: 'Design', development: 'In development', testing: 'Testing', completed: 'Completed' };

export default function ClientPage() {
  const [state, setState] = useState('loading');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        if (!u) return setState('out');
        try {
          setData(await api('/api/client/me'));
          setError('');
          setState('in');
        } catch {
          await signOut(auth);
          setError('This account is not set up as a client. Contact Axion Creatives.');
          setState('out');
        }
      }),
    []
  );

  if (state === 'loading') return <main className="login-wrap"><p className="muted">Loading…</p></main>;
  if (state === 'out') return <LoginForm title="Client login" hint="Use the email and password Axion Creatives sent you." error={error} />;
  return <Portal data={data} />;
}

function Portal({ data }) {
  return (
    <div className="container portal">
      <header className="portal-head">
        <a className="logo" href="/">Axion<span>Creatives</span></a>
        <button className="btn" onClick={() => signOut(auth)}>Sign out</button>
      </header>
      <h1>Hello, {data.client.name}</h1>
      <p className="muted">Here is where your projects stand.</p>
      {data.projects.length ? data.projects.map((p) => <ProjectCard key={p.id} p={p} />) : <div className="panel"><p className="muted">No projects yet. We will add them here as soon as work begins.</p></div>}
    </div>
  );
}

function ProjectCard({ p }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const send = async (e) => {
    e.preventDefault();
    try { await api('/api/client/message', { method: 'POST', body: { projectId: p.id, text } }); setText(''); setOpen(false); setMsg('Message sent. We will get back to you soon.'); }
    catch (er) { setMsg(er.message); }
  };
  return (
    <article className="panel pcard">
      <div className="row">
        <h3>{p.name}</h3>
        <span className={`badge ${p.status}`}>{LABEL[p.status]}</span>
      </div>
      {p.description && <p>{p.description}</p>}
      <div className="bar"><i style={{ width: `${p.progress}%` }} /></div>
      <small className="muted">{p.progress}% complete</small>
      {p.status === 'completed' && (
        <div className="service-box">
          {!open ? <button className="btn primary" onClick={() => setOpen(true)}>Request service or changes</button> : (
            <form onSubmit={send}>
              <textarea rows={4} placeholder="Tell us what you need serviced or updated" value={text} onChange={(e) => setText(e.target.value)} required />
              <button className="btn primary">Send message</button>
            </form>
          )}
        </div>
      )}
      {msg && <p className="muted">{msg}</p>}
    </article>
  );
}
