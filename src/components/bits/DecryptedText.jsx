import { useEffect, useRef, useState } from 'react';

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

export default function DecryptedText({
  text,
  speed              = 50,
  animateOn          = 'hover',
  sequential         = true,
  revealDirection    = 'start',
  characters         = DEFAULT_CHARS,
  useOriginalCharsOnly = false,
  maxIterations      = 10,
  className          = '',
  encryptedClassName = 'opacity-40',
  parentClassName    = '',
  style              = {},
  onAnimationComplete,
}) {
  const [displayChars, setDisplayChars] = useState(() =>
    text.split('').map((c) => ({ char: c, revealed: true }))
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef   = useRef(null);
  const iterRef       = useRef(0);
  const revealedRef   = useRef(new Set());
  const hasAnimatedRef = useRef(false);
  const containerRef  = useRef(null);

  const charPool = useOriginalCharsOnly ? [...new Set(text.split(''))] : characters.split('');
  const rndChar  = () => charPool[Math.floor(Math.random() * charPool.length)];

  const getOrder = () => {
    const indices = Array.from({ length: text.length }, (_, i) => i).filter((i) => text[i] !== ' ');
    if (revealDirection === 'end')    return [...indices].reverse();
    if (revealDirection === 'center') {
      const mid = Math.floor(indices.length / 2);
      return [...indices].sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid));
    }
    return indices;
  };

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    iterRef.current    = 0;
    revealedRef.current = new Set();
    const order = getOrder();

    setDisplayChars(text.split('').map((c) => ({
      char:     c === ' ' ? ' ' : rndChar(),
      revealed: c === ' ',
    })));

    intervalRef.current = setInterval(() => {
      iterRef.current++;

      if (sequential) {
        const nextIdx = order[revealedRef.current.size];
        if (nextIdx !== undefined) revealedRef.current.add(nextIdx);
      } else if (iterRef.current > maxIterations) {
        order.forEach((i) => revealedRef.current.add(i));
      }

      setDisplayChars(text.split('').map((c, i) => {
        if (c === ' ') return { char: ' ', revealed: true };
        if (revealedRef.current.has(i)) return { char: c, revealed: true };
        return { char: rndChar(), revealed: false };
      }));

      const nonSpace = text.split('').filter((c) => c !== ' ').length;
      if (revealedRef.current.size >= nonSpace) {
        clearInterval(intervalRef.current);
        setDisplayChars(text.split('').map((c) => ({ char: c, revealed: true })));
        setIsAnimating(false);
        onAnimationComplete?.();
      }
    }, speed);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setIsAnimating(false);
    setDisplayChars(text.split('').map((c) => ({ char: c, revealed: true })));
    revealedRef.current = new Set();
  };

  useEffect(() => {
    if (animateOn !== 'view') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          startAnimation();
        }
      },
      { threshold: 0.4 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => { observer.disconnect(); clearInterval(intervalRef.current); };
  }, [animateOn]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const handlers =
    animateOn === 'hover'
      ? { onMouseEnter: startAnimation, onMouseLeave: reset }
      : animateOn === 'click'
      ? { onClick: () => (isAnimating ? null : startAnimation()) }
      : {};

  return (
    <span ref={containerRef} className={parentClassName} style={style} {...handlers} aria-label={text}>
      <span
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}
        aria-hidden="false"
      >
        {text}
      </span>
      <span aria-hidden="true">
        {displayChars.map((item, i) => (
          <span key={i} className={item.revealed ? className : `${className} ${encryptedClassName}`.trim()}>
            {item.char}
          </span>
        ))}
      </span>
    </span>
  );
}
