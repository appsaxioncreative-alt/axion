'use client';

export function vid() {
  try {
    let v = localStorage.getItem('axion_vid');
    if (!v) { v = Math.random().toString(36).slice(2, 12); localStorage.setItem('axion_vid', v); }
    return v;
  } catch { return ''; }
}

export function track(payload) {
  const body = JSON.stringify({ vid: vid(), ref: document.referrer, ...payload });
  if (navigator.sendBeacon) navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
  else fetch('/api/track', { method: 'POST', body, keepalive: true });
}

export default function Works({ projects }) {
  if (!projects.length)
    return <p className="muted">New demos are on the way. Check back soon.</p>;
  return (
    <div className="works-grid">
      {projects.map((p) => (
        <a
          key={p.id}
          className="wcard"
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track({ type: 'click', projectId: p.id, label: p.title })}
        >
          <div className="wcard-cat">{p.category || 'Demo'}</div>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <div className="tags">{(p.tags || []).map((t) => <span key={t}>{t}</span>)}</div>
          <span className="wcard-link">Open live demo ↗</span>
        </a>
      ))}
    </div>
  );
}
