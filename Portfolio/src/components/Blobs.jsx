export default function Blobs({ variant = 'a' }) {
  if (variant === 'a') return (
    <>
      <div className="blob" style={{ width: 520, height: 520, background: 'var(--blob-a)', top: -80, right: -140 }} />
      <div className="blob" style={{ width: 380, height: 380, background: 'var(--blob-c)', top: 280, left: -160, opacity: .7 }} />
    </>
  );
  return (
    <>
      <div className="blob" style={{ width: 420, height: 420, background: 'var(--blob-b)', top: 40, left: -120 }} />
      <div className="blob" style={{ width: 340, height: 340, background: 'var(--blob-a)', bottom: -120, right: -80, opacity: .8 }} />
    </>
  );
}
