'use client';
import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

export default function LoginForm({ title, hint, memoryOnly, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    try {
      // admin: kept in memory only, so a reload always returns to this page
      await setPersistence(auth, memoryOnly ? inMemoryPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      setMsg('Email or password is incorrect.');
    }
    setBusy(false);
  }

  return (
    <main className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <a className="logo" href="/">Axion<span>Creatives</span></a>
        <h1>{title}</h1>
        <p className="muted">{hint}</p>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label>
        {(msg || error) && <p className="err">{msg || error}</p>}
        <button className="btn primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </main>
  );
}
