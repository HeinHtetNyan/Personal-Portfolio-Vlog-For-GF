import { useReveal } from '../hooks';
import { IMG } from '../data';
import Blobs from '../components/Blobs';

const PILLARS = [
  { t: 'Cook',    n: '1', d: 'Simple food, made the way I like.' },
  { t: 'Travel',  n: '2', d: 'Discovering places through food.' },
  { t: 'Capture', n: '3', d: 'Moments worth keeping.' },
  { t: 'Share',   n: '4', d: 'Things I enjoy along the way.' },
];

const TIMELINE = [
  { y: '1999', t: 'Born in Monywa, Myanmar', d: 'First memories shaped by home cooking and local flavors.' },
  { y: '2016', t: 'Culinary school, Lyon', d: 'Learned to hold a knife, and mostly how to listen.' },
  { y: '2019', t: 'Copenhagen',            d: 'Three years at a small, stubborn restaurant.' },
  { y: '2022', t: 'A year of travel',      d: 'Japan, Morocco, Italy, Georgia. Notebook #1.' },
  { y: '2023', t: 'July begins',           d: 'Private dinners, a journal, the first cookbook in progress.' },
];

export default function About() {
  useReveal();
  return (
    <div className="page" style={{ overflow: 'hidden' }}>
      <section className="container" style={{ paddingTop: 40, paddingBottom: 60, position: 'relative' }}>
        <Blobs variant="b" />
        <div style={{ position: 'relative' }}>
          <div className="reveal" style={{ color: 'var(--ink-3)', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 20 }}>— About</div>
          <h1 className="reveal d1" style={{ fontSize: 'clamp(56px,9vw,160px)', lineHeight: .95, letterSpacing: '-0.02em' }}>
            A <em>life</em> in <br />
            <span style={{ fontFamily: 'var(--script)', color: 'var(--accent)', fontSize: '1.1em' }}>food</span>
            <span> & places.</span>
          </h1>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'start' }}>
          <div className="reveal" style={{ position: 'sticky', top: 120 }}>
            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow)', aspectRatio: '3/4' }}>
              <img src={IMG.about} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="July" />
            </div>
            <div style={{ fontFamily: 'var(--script)', fontSize: 28, color: 'var(--accent)', marginTop: 20, textAlign: 'center' }}>— July, Lisbon 2026</div>
          </div>
          <div>
            <p className="reveal" style={{ fontFamily: 'var(--serif)', fontSize: 32, lineHeight: 1.3, color: 'var(--ink)' }}>
              I'm July — a chef who enjoys cooking and exploring new places.
            </p>
            <div style={{ display: 'grid', gap: 24, marginTop: 48 }}>
              <p className="reveal d1" style={{ fontSize: 17 }}>I started with simple meals at home, and over time became more curious about ingredients, flavors, and how people cook in different parts of the world. Traveling and cooking naturally became part of my life.</p>
              <p className="reveal d2" style={{ fontSize: 17 }}>Now, I spend my time cooking, discovering new food, and sharing the things I enjoy — simple dishes, places I visit, and everyday moments.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 72 }}>
              {PILLARS.map((p, i) => (
                <div key={p.t} className={`reveal d${i+1}`} style={{ padding: 28, border: '1px solid var(--line)', borderRadius: 20, background: 'var(--surface)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-3)', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase' }}>
                    <span>{p.n}</span><span style={{ color: 'var(--accent)' }}>●</span>
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 36, marginTop: 8 }}>{p.t}</div>
                  <p style={{ marginTop: 10, fontSize: 14 }}>{p.d}</p>
                </div>
              ))}
            </div>

            <h3 className="reveal" style={{ fontSize: 36, marginTop: 96, marginBottom: 32 }}>A short <em>timeline</em></h3>
            <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: 28 }}>
              {TIMELINE.map((e, i) => (
                <div key={e.y} className={`reveal d${(i%4)+1}`} style={{ position: 'relative', paddingBottom: 32 }}>
                  <div style={{ position: 'absolute', left: -34, top: 4, width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }} />
                  <div style={{ fontFamily: 'var(--script)', fontSize: 24, color: 'var(--accent-ink)' }}>{e.y}</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 22, marginTop: 2 }}>{e.t}</div>
                  <p style={{ marginTop: 4, fontSize: 14 }}>{e.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
