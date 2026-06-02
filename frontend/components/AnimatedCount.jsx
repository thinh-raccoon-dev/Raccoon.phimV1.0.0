'use client';

import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';

export default function AnimatedCount({ value = 0, duration = 1200, format = true }) {
  const [display, setDisplay] = useState(0);
  const stateRef = useRef({ n: 0 });

  useEffect(() => {
    const obj = stateRef.current;
    const target = Number(value) || 0;

    const anim = animate(obj, {
      n: target,
      duration,
      ease: 'outExpo',
      onUpdate: () => {
        setDisplay(Math.round(obj.n));
      }
    });

    return () => anim.pause();
  }, [value, duration]);

  return <>{format ? display.toLocaleString('vi-VN') : display}</>;
}
