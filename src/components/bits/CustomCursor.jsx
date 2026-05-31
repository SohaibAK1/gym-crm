import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  const dotX  = useSpring(mx, { damping: 50, stiffness: 800, mass: 0.1 });
  const dotY  = useSpring(my, { damping: 50, stiffness: 800, mass: 0.1 });
  const ringX = useSpring(mx, { damping: 22, stiffness: 180, mass: 0.2 });
  const ringY = useSpring(my, { damping: 22, stiffness: 180, mass: 0.2 });

  useEffect(() => {
    const move = (e) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener('mousemove', move, { passive: true });
    document.documentElement.style.cursor = 'none';
    return () => {
      window.removeEventListener('mousemove', move);
      document.documentElement.style.cursor = '';
    };
  }, [mx, my]);

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full"
        style={{
          x:            dotX,
          y:            dotY,
          translateX:   '-50%',
          translateY:   '-50%',
          width:        8,
          height:       8,
          background:   '#FACC15',
          boxShadow:    '0 0 12px rgba(250,204,21,0.9)',
          willChange:   'transform',
        }}
      />
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full"
        style={{
          x:            ringX,
          y:            ringY,
          translateX:   '-50%',
          translateY:   '-50%',
          width:        34,
          height:       34,
          border:       '1.5px solid rgba(250,204,21,0.55)',
          boxShadow:    '0 0 20px rgba(250,204,21,0.12), inset 0 0 8px rgba(250,204,21,0.06)',
          willChange:   'transform',
        }}
      />
    </>
  );
}
