"use client";

import { useEffect, useRef } from "react";

/* Fondo animado de Reservas: shader "Neuro Noise".
   Adaptado de Paper Shaders (https://shaders.paper.design/neuro-noise), licencia Apache-2.0,
   vía el Shader Builder de 21st.dev. El fragment shader es el original sin cambios; solo se
   ajustan los valores de color a la sección (paleta de luz de vela, sin rotación de tono y con
   saturación neutra para que la marca no cambie de color).

   - WebGL1 sin librerías, un triángulo que cubre todo el lienzo.
   - El cursor crea un foco de luz (spotlight) que aparece y desaparece suavemente.
   - Se pausa cuando la sección no está en pantalla o la pestaña está oculta.
   - Con "reducir movimiento" se pinta un solo fotograma fijo.
   - Sin WebGL se quedan las manchas CSS de la sección. */

const VERTICES = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`;

// Fragment shader original de "Neuro Noise" (21st.dev Shader Builder / Paper Shaders)
const FRAGMENTOS = `
// "Neuro Noise" — made with the 21st.dev Shader Builder
// Adapted from Paper Shaders: https://shaders.paper.design/neuro-noise
// Licensed under Apache-2.0: https://github.com/paper-design/shaders

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;
uniform vec4 u_shape;
uniform vec4 u_surface;
uniform vec4 u_finish;
uniform vec4 u_transform;
uniform vec4 u_space;
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  float n = sin(dot(p, vec2(41.0, 289.0)));
  return fract(vec2(15731.743, 7892.321) * n);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)),
    step(0.04045, c));
}
vec3 linearToSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, c));
}
vec3 linToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 mixColour(vec3 a, vec3 b, float t) {
  if (u_oklab > 0.5) {
    vec3 la = linToOklab(srgbToLinear(a));
    vec3 lb = linToOklab(srgbToLinear(b));
    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);
  }
  return mix(a, b, t);
}

vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mixColour(col, u_colors[i + 1],
        smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

vec3 hueRotate(vec3 col, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211,
                          0.587, -0.274, -0.523,
                          0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0,
                          0.956, -0.272, -1.106,
                          0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * col;
  float ca = cos(a), sa = sin(a);
  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);
  return toRGB * yiq;
}

vec3 shade(vec2 uv, vec2 p, float t) {
  vec2 q = p * (1.6 + u_intensity * 2.4);
  float field = 0.0;
  float weight = 0.55;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    q += vec2(
      sin(q.y * (1.7 + fi * 0.09) + t * (0.35 + fi * 0.04) + u_seed),
      cos(q.x * (1.5 + fi * 0.11) - t * (0.28 + fi * 0.03))
    ) * (0.22 + u_intensity * 0.14);
    float filaments = abs(sin(q.x + q.y + fi * 0.72));
    field += weight / (0.08 + filaments);
    weight *= 0.62;
    q = q.yx * vec2(-1.08, 1.04);
  }
  float glow = 1.0 - exp(-field * (0.018 + u_paramA * 0.04));
  return palette(clamp(glow, 0.0, 1.0));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;

  if (u_cursorPresence > 0.001) {
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy)
      / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = p - cursor;
    if (u_cursorEffect < 0.5) {
      p += cursor * u_cursorPresence * u_cursorStrength * 0.55;
    } else {
      float cursorDistance = length(cursorDelta);
      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);
      cursorMask = u_cursorPresence
        * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
      if (u_cursorEffect < 1.5) {
        p -= cursorDirection * cursorMask * u_cursorStrength * 0.24;
      } else if (u_cursorEffect < 2.5) {
        float cursorAngle = cursorMask * u_cursorStrength * 2.2;
        float cc = cos(cursorAngle), cs = sin(cursorAngle);
        p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;
      } else if (u_cursorEffect < 3.5) {
        float ripple = sin(
          cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0);
        p -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;
      }
    }
  }

  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;
  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }
  p += u_offset;
  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  if (u_warp > 0.0) {
    p += u_warp * (vec2(
      fbm(p * u_detail + u_seed),
      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }
  vec3 col;
  if (u_blur > 0.0) {
    float e = u_blur;
    float pe = e * u_scale;
    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;
    col  = shade(uv, p, u_time) * 0.36;
    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;
  } else {
    col = shade(uv, p, u_time);
  }
  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_hue) > 0.0001)
    col = hueRotate(col, u_hue);
  if (abs(u_brightness) > 0.0001)
    col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5)
    col += (vec3(0.18) + col * 0.12) * cursorMask * u_cursorStrength;
  if (u_grain > 0.0001)
    col += (grainHash(
      gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

/* Colores de la sección, de bajo a alto: crema → burdeos → vino profundo.
   Este shader pasa casi todo el tiempo en el primer tramo de la paleta y solo los filamentos
   llegan a los colores altos; por eso el contraste fuerte va justo al principio (crema → burdeos).
   Con dos colores parecidos al inicio (p. ej. arena y ámbar) el efecto casi no se ve. */
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const PALETA = ["#EACBA3", "#8E2F3E", "#3A1520"];   // el primero, casi igual que el fondo de la sección (#E8C9A0), para que no se note dónde empieza
const COLORES = new Float32Array(24);
PALETA.forEach((c, i) => COLORES.set(hex(c), i * 3));

// Valores de la receta (header del shader), reforzados para que el efecto se note más.
// El tercer valor de FORMA controla el grosor e intensidad de los filamentos: es el más eficaz para subir o bajar el efecto.
const FORMA = [1.26, 0.55, 1.1, 0.0];             // escala, intensidad (orig. 0.35), brillo de filamentos (orig. 0.28), warp
const SUPERFICIE = [1.82, 1.25, 0.0, 1.05];       // detalle, contraste (orig. 0.89), brillo, saturación (orig. 2.0)
const ACABADO = [0.0, 0.0, 0.0, 0.0];             // tono (orig. 5.85 rad = 335°), viñeta, desenfoque, grano
const TRANSFORMACION = [1372.0, 0.0, 0.08, 0.0];  // semilla, rotación, deriva, OKLab
const DESPLAZAMIENTO = [-0.09, 0.01];             // offset del campo
const CURSOR = { efecto: 4.0, fuerza: 0.6, radio: 0.55 }; // 4 = foco de luz (spotlight); fuerza orig. 0.4
const VELOCIDAD = 1.05;

export default function FondoNeuro() {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;
    // Con "reducir movimiento" se pinta un solo fotograma fijo
    const estatico = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return; // sin WebGL: se quedan las manchas CSS

    const compilar = (tipo: number, codigo: string) => {
      const sh = gl.createShader(tipo)!;
      gl.shaderSource(sh, codigo);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn("FondoNeuro:", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };
    const vs = compilar(gl.VERTEX_SHADER, VERTICES);
    const fs = compilar(gl.FRAGMENT_SHADER, FRAGMENTOS);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // Un único triángulo que cubre todo el lienzo
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uScene = u("u_scene"), uSpace = u("u_space"), uCursor = u("u_cursor");
    gl.uniform3fv(u("u_colors"), COLORES);
    gl.uniform4fv(u("u_shape"), FORMA);
    gl.uniform4fv(u("u_surface"), SUPERFICIE);
    gl.uniform4fv(u("u_finish"), ACABADO);
    gl.uniform4fv(u("u_transform"), TRANSFORMACION);

    // Resolución: devicePixelRatio con tope 2, como pide la receta, pero a la mitad: la sección es
    // muy alta y está detrás de un cristal desenfocado, así que a resolución completa el coste no se notaría
    const ajustar = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2) * 0.5;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    // Cursor: posición normalizada a -1..1 en el lienzo (y hacia arriba) y presencia que entra y sale suave
    const raton = { x: 0, y: 0, dentro: false };
    let presencia = 0;
    const mover = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      raton.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      raton.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      raton.dentro = e.pointerType === "mouse" && Math.abs(raton.x) <= 1 && Math.abs(raton.y) <= 1;
    };
    addEventListener("pointermove", mover, { passive: true });

    const pintar = (segundos: number) => {
      presencia += ((raton.dentro ? 1 : 0) - presencia) * 0.08;
      gl.uniform4f(uScene, canvas.width, canvas.height, segundos * VELOCIDAD, PALETA.length);
      gl.uniform4f(uSpace, DESPLAZAMIENTO[0], DESPLAZAMIENTO[1], raton.x, raton.y);
      gl.uniform4f(uCursor, presencia, CURSOR.efecto, CURSOR.fuerza, CURSOR.radio);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    ajustar();
    // Al cambiar el tamaño, el lienzo se borra: en modo fijo hay que volver a pintar el fotograma
    const redimension = new ResizeObserver(() => { ajustar(); if (estatico) pintar(0); });
    redimension.observe(canvas);

    // Con el shader funcionando, el contenedor lo indica con .con-shader (Reservas quita sus manchas CSS)
    const seccion = canvas.parentElement;
    seccion?.classList.add("con-shader");

    if (estatico) {
      pintar(0);
      return () => {
        redimension.disconnect();
        removeEventListener("pointermove", mover);
        seccion?.classList.remove("con-shader");
      };
    }

    let raf = 0;
    let inicio = performance.now();
    let pausadoEn = 0;
    const fotograma = (ahora: number) => {
      pintar((ahora - inicio) / 1000);
      raf = requestAnimationFrame(fotograma);
    };

    // Pausa fuera de pantalla o con la pestaña oculta; al volver, la animación sigue donde iba
    let visible = false;
    const actualizar = () => {
      const activo = visible && document.visibilityState !== "hidden";
      if (activo && !raf) {
        if (pausadoEn) inicio += performance.now() - pausadoEn;
        raf = requestAnimationFrame(fotograma);
      } else if (!activo && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        pausadoEn = performance.now();
      }
    };
    const observador = new IntersectionObserver(([e]) => { visible = e.isIntersecting; actualizar(); });
    observador.observe(canvas);
    document.addEventListener("visibilitychange", actualizar);

    return () => {
      cancelAnimationFrame(raf);
      observador.disconnect();
      redimension.disconnect();
      removeEventListener("pointermove", mover);
      document.removeEventListener("visibilitychange", actualizar);
      seccion?.classList.remove("con-shader");
    };
  }, []);

  return <canvas ref={lienzo} className="fondo-shader" aria-hidden="true" />;
}
