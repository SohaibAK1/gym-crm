import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RotatingText.css';

const RotatingText = forwardRef(function RotatingText(
  {
    texts,
    transition            = { type: 'spring', damping: 25, stiffness: 300 },
    initial               = { y: '100%', opacity: 0 },
    animate               = { y: 0, opacity: 1 },
    exit                  = { y: '-120%', opacity: 0 },
    animatePresenceMode   = 'wait',
    animatePresenceInitial = false,
    rotationInterval      = 2000,
    staggerDuration       = 0,
    staggerFrom           = 'first',
    loop                  = true,
    auto                  = true,
    splitBy               = 'characters',
    onNext,
    mainClassName         = '',
    splitLevelClassName   = '',
    elementLevelClassName = '',
    style,
  },
  ref
) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  function advance() {
    setIndex((prev) => {
      const next = loop ? (prev + 1) % texts.length : Math.min(prev + 1, texts.length - 1);
      onNext?.(next, texts[next]);
      return next;
    });
  }

  useImperativeHandle(ref, () => ({
    next:     advance,
    previous: () => setIndex((p) => (p - 1 + texts.length) % texts.length),
    jumpTo:   (i) => setIndex(Math.min(Math.max(0, i), texts.length - 1)),
    reset:    () => setIndex(0),
  }));

  useEffect(() => {
    if (!auto) return;
    timerRef.current = setInterval(advance, rotationInterval);
    return () => clearInterval(timerRef.current);
  }, [auto, rotationInterval, loop, texts.length]);

  const current = texts[index] ?? '';

  function getElements() {
    if (splitBy === 'characters') return current.split('');
    if (splitBy === 'words')      return current.split(' ');
    if (splitBy === 'lines')      return current.split('\n');
    return current.split(splitBy);
  }
  const elements = getElements();
  const isWords  = splitBy === 'words';

  function staggerDelay(i) {
    if (!staggerDuration) return 0;
    const len = elements.length;
    if (staggerFrom === 'last')   return (len - 1 - i) * staggerDuration;
    if (staggerFrom === 'center') return Math.abs(i - Math.floor(len / 2)) * staggerDuration;
    if (staggerFrom === 'random') return Math.random() * staggerDuration * len * 0.5;
    return i * staggerDuration;
  }

  return (
    <span
      className={`text-rotate${mainClassName ? ` ${mainClassName}` : ''}`}
      aria-label={current}
      style={style}
    >
      <span className="text-rotate-sr-only">{current}</span>
      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        <motion.span
          key={index}
          className={`text-rotate-word${splitLevelClassName ? ` ${splitLevelClassName}` : ''}`}
          aria-hidden="true"
        >
          {elements.map((el, i) => (
            <motion.span
              key={i}
              initial={initial}
              animate={animate}
              exit={exit}
              transition={{ ...transition, delay: staggerDelay(i) }}
              className={`text-rotate-element${elementLevelClassName ? ` ${elementLevelClassName}` : ''}`}
            >
              {el}
              {isWords && i < elements.length - 1 ? ' ' : ''}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
});

export default RotatingText;
