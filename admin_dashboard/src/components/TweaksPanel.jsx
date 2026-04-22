import Icon from './Icon.jsx';

export default function TweaksPanel({ open, close, tweaks, setTweak, theme, setTheme, collapsed, setCollapsed }) {
  if (!open) return null;
  const accents = [
    { key: 'blush',    color: '#E8A5A0' },
    { key: 'coral',    color: '#E88A7A' },
    { key: 'sage',     color: '#A8B5A0' },
    { key: 'lavender', color: '#B8A4CE' },
    { key: 'ochre',    color: '#D4B07A' },
  ];
  return (
    <div className="tweaks-panel open">
      <div className="tweaks-title">
        <span>Tweaks <em style={{color:'var(--ink-faint)',fontStyle:'normal',fontFamily:'var(--f-ui)',fontSize:11,fontWeight:400,letterSpacing:'0.1em',textTransform:'uppercase',marginLeft:6}}>studio</em></span>
        <button className="icon-btn" style={{width:26,height:26}} onClick={close}><Icon name="x" size={14} /></button>
      </div>

      <div className="tweaks-row">
        <label>Accent</label>
        <div className="tweaks-swatches">
          {accents.map(a => (
            <div key={a.key}
              className={'tweaks-swatch' + (tweaks.accent === a.key ? ' active' : '')}
              style={{background: a.color}}
              onClick={() => setTweak('accent', a.key)}
            />
          ))}
        </div>
      </div>

      <div className="tweaks-row">
        <label>Theme</label>
        <div className="tweaks-seg">
          <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>Light</button>
          <button className={theme === 'dark'  ? 'active' : ''} onClick={() => setTheme('dark')}>Dark</button>
        </div>
      </div>

      <div className="tweaks-row">
        <label>Dashboard layout</label>
        <div className="tweaks-seg">
          <button className={tweaks.dashboard === 'editorial' ? 'active' : ''} onClick={() => setTweak('dashboard', 'editorial')}>Editorial</button>
          <button className={tweaks.dashboard === 'grid'      ? 'active' : ''} onClick={() => setTweak('dashboard', 'grid')}>Grid</button>
        </div>
      </div>

      <div className="tweaks-row">
        <label>Editor style</label>
        <div className="tweaks-seg">
          <button className={tweaks.editor === 'medium' ? 'active' : ''} onClick={() => setTweak('editor', 'medium')}>Medium</button>
          <button className={tweaks.editor === 'notion' ? 'active' : ''} onClick={() => setTweak('editor', 'notion')}>Notion</button>
        </div>
      </div>

      <div className="tweaks-row">
        <label>Sidebar</label>
        <div className="tweaks-seg">
          <button className={!collapsed ? 'active' : ''} onClick={() => setCollapsed(false)}>Expanded</button>
          <button className={collapsed  ? 'active' : ''} onClick={() => setCollapsed(true)}>Collapsed</button>
        </div>
      </div>

      <div className="tweaks-row">
        <label>Card radius · {tweaks.radius}px</label>
        <input type="range" min="6" max="24" step="2" value={tweaks.radius}
          onChange={e => setTweak('radius', +e.target.value)}
          style={{accentColor:'var(--accent)'}} />
      </div>
    </div>
  );
}
