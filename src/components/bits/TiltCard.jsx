import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function TiltCard({
  children,
  rotateAmplitude = 10,
  scaleOnHover    = 1.02,
  className       = '',
  style           = {},
  ...props
}) {
  const ref = useRef(null);

  const rotX = useSpring(useMotionValue(0), { stiffness: 120, damping: 30, mass: 0.5 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 120, damping: 30, mass: 0.5 });
  const sc   = useSpring(useMotionValue(1), { stiffness: 120, damping: 30, mass: 0.5 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    const ny   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    rotX.set(ny * -rotateAmplitude);
    rotY.set(nx *  rotateAmplitude);
  };

  return (
    <div style={{ perspective: '1000px' }}>
      <motion.div
        ref={ref}
        className={className}
        style={{ rotateX: rotX, rotateY: rotY, scale: sc, ...style }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => sc.set(scaleOnHover)}
        onMouseLeave={() => { rotX.set(0); rotY.set(0); sc.set(1); }}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  );
}
