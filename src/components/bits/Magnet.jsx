import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function Magnet({ children, strength = 0.4, className = '', style = {}, ...props }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - rect.left - rect.width  / 2) * strength,
      y: (e.clientY - rect.top  - rect.height / 2) * strength,
    });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      animate={pos}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      {...props}
    >
      {children}
    </motion.div>
  );
}
