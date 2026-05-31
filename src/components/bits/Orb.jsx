import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './Orb.css';

const vert = `attribute vec2 uv; attribute vec2 position; varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 0, 1); }`;

const frag = `
precision highp float;
uniform float uTime;
uniform float uHue;
uniform float uHovered;
uniform vec2 uResolution;
varying vec2 vUv;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1  = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy  -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0,i1.y,1.0)) + i.x + vec3(0.0,i1.x,1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 hueShift(vec3 col, float h) {
  float c = cos(h), s = sin(h);
  return vec3(
    col.r*(0.299+0.701*c+0.168*s) + col.g*(0.587-0.587*c+0.330*s) + col.b*(0.114-0.114*c-0.497*s),
    col.r*(0.299-0.299*c-0.328*s) + col.g*(0.587+0.413*c+0.035*s) + col.b*(0.114-0.114*c+0.292*s),
    col.r*(0.299-0.300*c+1.250*s) + col.g*(0.587-0.588*c-1.050*s) + col.b*(0.114+0.886*c-0.203*s)
  );
}

void main() {
  vec2 uv = vUv - 0.5;
  uv.x *= uResolution.x / uResolution.y;
  float dist = length(uv);
  float t = uTime * 0.35;

  float n1 = snoise(uv * 2.5 + vec2(t*0.5,  t*0.3));
  float n2 = snoise(uv * 5.0 + vec2(-t*0.2,  t*0.7));
  float n3 = snoise(uv * 9.0 + vec2( t*0.6, -t*0.4));
  float noise = n1*0.5 + n2*0.3 + n3*0.2;

  float radius = 0.30 + uHovered * 0.05;
  float edge   = radius + 0.09 + noise * 0.05;
  float orb    = 1.0 - smoothstep(radius - 0.02, edge, dist + noise * 0.04);
  float inner  = 1.0 - smoothstep(0.0, radius * 0.65, dist);

  vec3 cA = vec3(0.45, 0.15, 1.0);
  vec3 cB = vec3(0.05, 0.55, 1.0);
  vec3 cC = vec3(0.95, 0.20, 0.85);

  float m = noise * 0.5 + 0.5;
  vec3 orbColor = mix(mix(cA, cB, m), cC, smoothstep(0.0, radius, dist) * 0.4);
  orbColor = hueShift(orbColor, uHue);

  float rim    = pow(1.0 - inner, 3.0) * orb * 1.2;
  vec3 rimCol  = hueShift(cB, uHue);
  float glow   = pow(max(0.0, 1.0 - dist / (radius + 0.55)), 2.2) * 0.45;
  vec3 glowCol = hueShift(cA, uHue);

  vec3  final = orbColor * orb + rimCol * rim + glowCol * glow;
  float alpha = min(1.0, orb * 0.92 + inner * 0.08 + glow * 0.55);

  gl_FragColor = vec4(final, alpha);
}
`;

export default function Orb({
  hue            = 0,
  hoverIntensity = 0.2,
  rotateOnHover  = true,
  forceHoverState = false,
  backgroundColor = 'transparent',
}) {
  const ctnDom = useRef(null);

  useEffect(() => {
    const el = ctnDom.current;
    if (!el) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const canvas = gl.canvas;
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    el.appendChild(canvas);

    let isVisible = false;
    const visObserver = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    visObserver.observe(el);

    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        uTime:       { value: 0 },
        uHue:        { value: (hue * Math.PI) / 180 },
        uHovered:    { value: forceHoverState ? 1 : 0 },
        uResolution: { value: [1, 1] },
      },
      transparent: true,
      depthTest:   false,
      depthWrite:  false,
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      const w = el.offsetWidth  || 1;
      const h = el.offsetHeight || 1;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();

    let targetHover  = forceHoverState ? 1 : 0;
    let currentHover = targetHover;

    const onMouseMove = (e) => {
      if (!rotateOnHover || forceHoverState) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const r  = Math.min(rect.width, rect.height) * 0.5;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      targetHover = (dx * dx + dy * dy <= r * r) ? 1 : 0;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let rafId;
    const tick = (t) => {
      rafId = requestAnimationFrame(tick);
      if (!isVisible) return;
      currentHover += (targetHover - currentHover) * 0.07;
      program.uniforms.uTime.value    = t * 0.001;
      program.uniforms.uHovered.value = currentHover * hoverIntensity;
      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      visObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      if (el.contains(canvas)) el.removeChild(canvas);
      try { gl.getExtension('WEBGL_lose_context')?.loseContext(); } catch (_) {}
    };
  }, [hue, hoverIntensity, rotateOnHover, forceHoverState]);

  return (
    <div
      ref={ctnDom}
      className="orb-container"
      style={{ background: backgroundColor }}
    />
  );
}
