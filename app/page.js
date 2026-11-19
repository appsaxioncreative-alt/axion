import Works from '@/components/Works';
import Tracker from '@/components/Tracker';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

async function getProjects() {
  try {
    const snap = await db().collection('projects').orderBy('createdAt', 'desc').get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}

const services = [
  ['Mobile apps', 'High-performance Android and iOS apps built with Flutter.'],
  ['Web platforms', 'Modern web apps, dashboards and e-commerce platforms.'],
  ['Business systems', 'Inventory, production, ordering and management software shaped around your workflow.'],
  ['Custom solutions', 'Software designed around your requirements, processes and goals.'],
];
const steps = [
  ['Discover', 'We learn your idea, goals, users and requirements.'],
  ['Design', 'We plan the experience, interface and technical direction.'],
  ['Build', 'We develop, test, debug and refine the product.'],
  ['Launch', 'We deploy your product and help you get it running.'],
  ['Support', 'We stay with you after launch: fixes, updates and servicing whenever you need them.'],
];
const practices = [
  ['Real-time by default', 'Live data and sync built in from day one, so dashboards and chats update the moment something changes.'],
  ['Clean architecture', 'Modular codebases that are easy to extend, hand off and maintain long after launch.'],
  ['Cross-platform first', 'One Flutter codebase with native performance on Android and iOS, in half the time.'],
  ['Cloud-native', 'Infrastructure that scales with your users, not against them.'],
  ['Secure by design', 'Authentication, encryption and data handling done right from the start.'],
];
const tech = ['Flutter', 'Dart', 'Node.js', 'MongoDB', 'Express', 'Firebase', 'Laravel', 'MySQL', 'Next.js', 'Git', 'Figma', 'Cloudinary'];

const about = [
  ['Who we are', 'Axion Creatives is a software studio that builds mobile apps, web platforms and business systems. We work with founders, shops and institutions who have an idea and need a reliable team to build it.'],
  ['What drives us', 'Ideas. Code. Real impact. We measure our work by whether people actually use what we ship, not by how much we deliver.'],
  ['How we work', 'Small team, direct communication. You talk to the people writing your code, and you see progress at every stage.'],
];

const industries = [
  ['Fitness & wellness', 'Training, tracking and membership apps.'],
  ['Fashion & e-commerce', 'Online stores, booking and order flows, COD and online payments.'],
  ['Education', 'Admin dashboards, content and student-facing sites.'],
  ['Healthcare', 'Appointments, records and patient-facing apps.'],
  ['Small business', 'Inventory, production and ordering systems.'],
];

const whyUs = [
  ['One team, end to end', 'Design, development, testing and launch under one roof. No hand-offs between vendors.'],
  ['After-service as a promise', 'We treat support as seriously as the build. Your product keeps working and keeps improving.'],
  ['Live client portal', 'Log in any time to see your project status, and request servicing after launch.'],
  ['See it before you buy', 'Working demos you can open and try, so you know the quality up front.'],
];

const duo = [
  ['Development', 'Great development gets you live.', [
    'Designed around your goals and users',
    'Built, tested and refined with you',
    'Deployed and ready to use',
  ]],
  ['After-service', 'Great after-service keeps you growing.', [
    'Fixes and updates after launch',
    'Request servicing from your client portal',
    'New features as your business grows',
  ]],
];

const faqs = [
  ['How long does a project take?', 'It depends on scope. A focused website or small app can take a few weeks, while larger platforms take longer. We give a timeline after the discovery call.'], // [edit]
  ['How much does it cost?', 'Pricing depends on features, platforms and complexity. Email us your idea and we will send a clear quote.'], // [edit]
  ['Do you build for both Android and iOS?', 'Yes. We use Flutter, so one codebase runs natively on both.'],
  ['Can I track my project?', 'Yes. Clients get a login to the portal where they can see whether their project is in development or completed.'],
  ['Do you support the product after launch?', 'Yes. After-service matters as much to us as development. Message us through the client portal to request servicing or updates any time.'],
  ['Where are you based?', 'India. We work with clients remotely.'], // [edit: add your city]
];

export default async function Home() {
  const projects = await getProjects();
  return (
    <>
      <Tracker />
      <header className="nav-wrap">
        <nav className="container nav">
          <a className="logo" href="#">Axion<span>Creatives</span></a>
          <div className="navlinks">
            <a href="#about">About</a>
            <a href="#works">Our work</a>
            <a href="#services">Services</a>
            <a href="#process">Process</a>
            <a href="#support">After-service</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="navcta">
            <a className="btn ghost" href="/client">Client login</a>
            <a className="btn primary" href="#contact">Start a project</a>
          </div>
        </nav>
      </header>

      <main>
        <section className="container hero">
          <div>
            <p className="kicker">Ideas. Code. Real impact.</p>
            <h1>We turn ideas into products people actually use.</h1>
            <p className="lead">Mobile apps, web platforms and custom software. From idea to design, development and launch, and we stay with you after.</p>
            <p className="pill">Development + After-service. Equal priority.</p>
            <div className="actions">
              <a className="btn primary" href="#contact">Start a project</a>
              <a className="btn" href="#works">See our work</a>
            </div>
          </div>
          <div className="hero-panel" aria-hidden="true">
            <div className="hp-top"><i /><i /><i /></div>
            <div className="hp-body">
              <div className="hp-row big" />
              <div className="hp-row" /><div className="hp-row short" />
              <div className="hp-grid"><b /><b /><b /></div>
            </div>
          </div>
        </section>

        <section className="container stats">
          <div><strong>5+</strong><span>Apps launched</span></div>
          <div><strong>3+</strong><span>Happy clients</span></div>
          <div><strong>2+</strong><span>Years of experience</span></div>
          <div><strong>100%</strong><span>Client focused</span></div>
        </section>

        <section className="container section" id="about">
          <div className="sectionhead"><h2>About Axion Creatives</h2><p>A software studio focused on building products that last.</p></div>
          <div className="cards three">
            {about.map(([t, d]) => <article className="card" key={t}><h3>{t}</h3><p>{d}</p></article>)}
          </div>
        </section>

        <section className="container section" id="how">
          <div className="sectionhead"><h2>Engineering behind every launch</h2><p>The practices we bring to every product, so what we ship is fast, reliable and built to grow.</p></div>
          <div className="cards five">
            {practices.map(([t, d]) => <article className="card" key={t}><h3>{t}</h3><p>{d}</p></article>)}
          </div>
        </section>

        <section className="container section" id="works">
          <div className="sectionhead"><h2>Our work</h2><p>Live demos across fitness, fashion, e-commerce, education and healthcare. Open any to explore.</p></div>
          <Works projects={projects} />
        </section>

        <section className="container section" id="services">
          <div className="sectionhead"><h2>What we build</h2><p>End-to-end development to help you build, grow and scale your ideas.</p></div>
          <div className="cards four">
            {services.map(([t, d]) => <article className="card" key={t}><h3>{t}</h3><p>{d}</p></article>)}
          </div>
        </section>

        <section className="container section" id="industries">
          <div className="sectionhead"><h2>Industries we serve</h2><p>Experience across sectors, with solutions shaped to each one.</p></div>
          <div className="cards five">
            {industries.map(([t, d]) => <article className="card" key={t}><h3>{t}</h3><p>{d}</p></article>)}
          </div>
        </section>

        <section className="container section" id="process">
          <div className="sectionhead"><h2>From idea to launch, and beyond</h2><p>Launch day is the start of our work, not the end.</p></div>
          <ol className="steps">
            {steps.map(([t, d], i) => <li key={t}><span>{i + 1}</span><h3>{t}</h3><p>{d}</p></li>)}
          </ol>
        </section>

        <section className="container section" id="support">
          <div className="sectionhead"><h2>We don&rsquo;t just build it. We stay with it.</h2><p>After-service is as important to us as development. Your product keeps needing care after it launches, and we keep showing up.</p></div>
          <div className="duo">
            {duo.map(([t, s, list]) => (
              <article className="duo-card" key={t}>
                <h3>{t}</h3>
                <p className="duo-slogan">{s}</p>
                <ul>{list.map((x) => <li key={x}>{x}</li>)}</ul>
              </article>
            ))}
          </div>
          <p className="banner">Development builds your product. After-service protects your investment.</p>
        </section>

        <section className="container section" id="why">
          <div className="sectionhead"><h2>Why work with us</h2></div>
          <div className="cards four">
            {whyUs.map(([t, d]) => <article className="card" key={t}><h3>{t}</h3><p>{d}</p></article>)}
          </div>
        </section>

        <section className="container section">
          <div className="sectionhead"><h2>Built with modern tools</h2></div>
          <div className="techs">{tech.map((t) => <span key={t}>{t}</span>)}</div>
        </section>

        <section className="container section" id="faq">
          <div className="sectionhead"><h2>Frequently asked questions</h2></div>
          <div className="faq">
            {faqs.map(([q, a]) => (
              <details key={q}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </section>

        <section className="container section" id="contact">
          <div className="cta">
            <h2>Your idea could be the next product we build</h2>
            <p>Tell us what you want to create. We will build it, launch it and stay with you after.</p>
            <a className="btn primary" href="mailto:apps.axion.creative@gmail.com?subject=Project%20Inquiry%20for%20Axion%20Creatives">Email us about your project</a>
          </div>
        </section>
      </main>

      <footer>
        <div className="container foot">
          <div><strong>Axion Creatives</strong><br />Ideas. Code. Real impact.<br />Built right. Supported always.</div>
          <div>apps.axion.creative@gmail.com<br />+91 77369 65095</div>
          <div>© 2026 Axion Creatives<br /><a href="/client">Client login</a></div>
        </div>
      </footer>
    </>
  );
}