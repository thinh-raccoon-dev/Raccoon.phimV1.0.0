'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

export default function AnimatedGrid({ children, signature }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const cards = ref.current.querySelectorAll('.movie-card');
    if (!cards.length) return;

    cards.forEach((c) => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(24px)';
    });

    const anim = animate(cards, {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 650,
      delay: stagger(45, { from: 'first' }),
      ease: 'outExpo',
      onComplete: () => {
        cards.forEach((c) => {
          c.style.opacity = '';
          c.style.transform = '';
        });
      }
    });

    return () => anim.pause();
  }, [signature]);

  return (
    <section className="movie-grid" ref={ref}>
      {children}
    </section>
  );
}
