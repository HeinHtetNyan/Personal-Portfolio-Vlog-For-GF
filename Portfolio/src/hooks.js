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
