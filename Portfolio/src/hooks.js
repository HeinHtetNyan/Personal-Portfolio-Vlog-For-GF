import { useEffect, useLayoutEffect } from 'react';

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

export function useScrollTop(dep) {
  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [dep]);
}

export function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso);
  if (isNaN(d)) return iso;
  const day = String(d.getDate()).padStart(2, '0');
  const mon = d.toLocaleString('en', { month: 'short' });
  return `${day}/${mon}/${d.getFullYear()}`;
}
