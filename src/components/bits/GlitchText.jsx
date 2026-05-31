import './GlitchText.css';

export default function GlitchText({
  children,
  speed         = 1,
  enableShadows = true,
  enableOnHover = false,
  className     = '',
  bgColor       = '#0A0A0A',
  style         = {},
}) {
  const cssVars = {
    '--after-duration':  `${speed * 3}s`,
    '--before-duration': `${speed * 2}s`,
    '--after-shadow':    enableShadows ? '-5px 0 #FF4444' : 'none',
    '--before-shadow':   enableShadows ? '5px 0 #44FFFF'  : 'none',
    '--glitch-bg':       bgColor,
  };
  return (
    <div
      className={`glitch${enableOnHover ? ' enable-on-hover' : ''}${className ? ` ${className}` : ''}`}
      style={{ ...cssVars, ...style }}
      data-text={typeof children === 'string' ? children : undefined}
    >
      {children}
    </div>
  );
}
