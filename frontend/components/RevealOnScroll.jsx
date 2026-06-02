'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

export default function RevealOnScroll({
  children,
  selector = ':scope > *',
  threshold = 0.15,
  delay = 0,
  staggerMs = 100,
  className
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const targets = ref.current.querySelectorAll(selector);
    if (!targets.length) return;

    targets.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(targets, {
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              delay: stagger(staggerMs, { start: delay }),
              ease: 'outExpo',
              onComplete: () => {
                targets.forEach((el) => {
                  el.style.opacity = '';
                  el.style.transform = '';
                });
              }
            });
            observer.disconnect();
          }
        });
      },
      { threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [selector, threshold, delay, staggerMs]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
