export const ACCENTS = [
  { k: 'pink',  primary: '#F4A7B9', soft: '#F9D5DD', ink: '#B24A68', accent: '#E78CA3' },
  { k: 'rose',  primary: '#E9A5A0', soft: '#F5D8D0', ink: '#A85E54', accent: '#D97B72' },
  { k: 'peach', primary: '#F4C59A', soft: '#FBE4CC', ink: '#A8663A', accent: '#E39460' },
  { k: 'sage',  primary: '#A8C4A2', soft: '#D4E3CE', ink: '#53754D', accent: '#7FA478' },
];

export default function TweaksPanel({ enabled, mode, setMode, accent, setAccent }) {
  if (!enabled) return null;
  return (
    <div className="tweaks">
      <h4>Tweaks</h4>
      <div className="tweaks-row">
        <span>Dark mode</span>
        <button className={`toggle${mode === 'dark' ? ' on' : ''}`} onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} />
      </div>
      <div className="tweaks-row">
        <span>Accent</span>
        <div className="swatches">
          {ACCENTS.map((a) => (
            <div key={a.k} className={`swatch${accent.k === a.k ? ' active' : ''}`} style={{ background: a.accent }} onClick={() => setAccent(a)} />
          ))}
        </div>
      </div>
    </div>
  );
}
