const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'hello@julystudio.co';
const SITE_LOCATION = import.meta.env.VITE_SITE_LOCATION || 'Lisbon';

const SOCIAL_LINKS = [
  ['Instagram', import.meta.env.VITE_SOCIAL_INSTAGRAM],
  ['Facebook',  import.meta.env.VITE_SOCIAL_FACEBOOK],
  ['Line',      import.meta.env.VITE_SOCIAL_LINE],
  ['TikTok',    import.meta.env.VITE_SOCIAL_TIKTOK],
  ['X (Twitter)', import.meta.env.VITE_SOCIAL_TWITTER],
].filter(([, url]) => url);

export default function Footer({ go }) {
  return (
    <footer className="footer container">
      <div className="footer-grid">
        <div className="reveal">
          <h2>Let's make <br /><em>something</em> <span className="script">beautiful</span></h2>
          <button className="btn btn-primary" style={{ marginTop: 28 }} onClick={() => go('contact')}>
            Get in touch <span className="arrow">→</span>
          </button>
        </div>
        <div className="footer-col reveal d2">
          <h5>Find me</h5>
          {SOCIAL_LINKS.map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer">{label}</a>
          ))}
        </div>
        <div className="footer-col reveal d3">
          <h5>Explore</h5>
          <a onClick={() => go('about')}>About</a>
          <a onClick={() => go('work')}>Work</a>
          <a onClick={() => go('journal')}>Journal</a>
          <a onClick={() => go('contact')}>Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} July · Made with love</span>
        <span>{CONTACT_EMAIL}</span>
      </div>
    </footer>
  );
}
