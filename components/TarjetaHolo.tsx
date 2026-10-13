"use client";

import { useCallback, useEffect, useRef } from "react";

/* Tarjeta holográfica: se inclina en 3D siguiendo el cursor, como una tarjeta física.
   Adaptada de "Holo Card" de Motiq (https://motiq.dev/components/holo-card, licencia MIT),
   sin Tailwind ni dependencias y con la lámina en los colores de la marca.

   - Dos muelles poco amortiguados persiguen el cursor: la tarjeta va un poco por detrás
     y al soltarla se pasa ligeramente de su sitio antes de quedarse quieta.
   - El brillo y la lámina holográfica siguen al cursor al instante: la luz no tiene peso.
   - La sombra del suelo se mueve al contrario que la inclinación.
   - Sin cursor encima, la tarjeta se balancea muy despacio.
   - Se pausa fuera de pantalla y, con "reducir movimiento", se queda en una pose fija. */

class Muelle {
  x = 0;
  v = 0;
  objetivo = 0;
  constructor(private k: number, private d: number) {}
  paso(dt: number) {
    const a = this.k * (this.objetivo - this.x) - this.d * this.v;
    this.v += a * dt;
    this.x += this.v * dt;
    return this.x;
  }
}

const limitar = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const MAX_X = 11;   // inclinación máxima arriba/abajo (grados)
const MAX_Y = 15;   // inclinación máxima izquierda/derecha
const REPOSO = { rx: -6, ry: 8, px: 0.62, py: 0.3 };   // pose fija con "reducir movimiento"

export default function TarjetaHolo({ children }: { children: React.ReactNode }) {
  const raiz = useRef<HTMLDivElement>(null);
  const tarjeta = useRef<HTMLDivElement>(null);
  const sombra = useRef<HTMLDivElement>(null);
  const muelles = useRef({ x: new Muelle(120, 10), y: new Muelle(120, 10) });
  const luz = useRef({ px: 0.5, py: 0.5, encima: false });

  // Aplica la inclinación y la posición de la luz. Solo toca transform y variables CSS,
  // así que el contenido de la tarjeta nunca se vuelve a pintar.
  const pintar = useCallback((rx: number, ry: number) => {
    const t = tarjeta.current;
    if (!t) return;
    const { px, py } = luz.current;
    t.style.transform = `rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`;
    t.style.setProperty("--holo-px", px.toFixed(4));
    t.style.setProperty("--holo-py", py.toFixed(4));
    t.style.setProperty("--holo-tono", (ry * 1.5 + (px - 0.5) * 16).toFixed(2));
    const inclinacion = (Math.abs(rx) + Math.abs(ry)) / (MAX_X + MAX_Y);
    t.style.setProperty("--holo-brillo", (0.22 + inclinacion * 0.4).toFixed(3));
    if (sombra.current) {
      sombra.current.style.transform = `translate3d(${(-ry * 1.8).toFixed(2)}px, ${(rx * 1.2).toFixed(2)}px, 0) scale(${(1 + inclinacion * 0.08).toFixed(3)})`;
      sombra.current.style.opacity = (0.75 + inclinacion * 0.25).toFixed(3);
    }
  }, []);

  useEffect(() => {
    // Con "reducir movimiento": pose fija, todavía en 3D pero sin animación
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      luz.current = { px: REPOSO.px, py: REPOSO.py, encima: false };
      pintar(REPOSO.rx, REPOSO.ry);
      return;
    }

    let raf = 0;
    let ultimo = 0;
    let tiempo = 0;
    let visible = true;

    const fotograma = (ahora: number) => {
      const dt = limitar((ahora - (ultimo || ahora)) / 1000, 0, 0.05);
      ultimo = ahora;
      tiempo += dt;
      const { x, y } = muelles.current;
      const l = luz.current;
      if (!l.encima) {
        // Balanceo lento en reposo; la luz vuelve al centro más rápido que la tarjeta
        y.objetivo = Math.sin(tiempo * 0.5) * 4;
        x.objetivo = Math.cos(tiempo * 0.37) * 3;
        const ritmo = Math.min(1, dt * 2);
        l.px += (0.5 - l.px) * ritmo;
        l.py += (0.5 - l.py) * ritmo;
      }
      pintar(x.paso(dt), y.paso(dt));
      raf = requestAnimationFrame(fotograma);
    };

    const arrancar = () => { if (!raf) { ultimo = 0; raf = requestAnimationFrame(fotograma); } };
    const parar = () => { cancelAnimationFrame(raf); raf = 0; };
    const actualizar = () => (visible && document.visibilityState !== "hidden" ? arrancar() : parar());

    // Pausa cuando la tarjeta no está en pantalla o la pestaña está oculta
    const observador = new IntersectionObserver(([e]) => { visible = e.isIntersecting; actualizar(); }, { threshold: 0.05 });
    if (raiz.current) observador.observe(raiz.current);
    document.addEventListener("visibilitychange", actualizar);
    actualizar();

    return () => {
      parar();
      observador.disconnect();
      document.removeEventListener("visibilitychange", actualizar);
    };
  }, [pintar]);

  const seguir = (e: React.PointerEvent) => {
    const t = tarjeta.current;
    if (!t) return;
    const r = t.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const px = limitar((e.clientX - r.left) / r.width, 0, 1);
    const py = limitar((e.clientY - r.top) / r.height, 0, 1);
    luz.current = { px, py, encima: true };
    muelles.current.y.objetivo = (px - 0.5) * 2 * MAX_Y;
    muelles.current.x.objetivo = -(py - 0.5) * 2 * MAX_X;
  };
  const soltar = () => { luz.current.encima = false; };

  return (
    <div
      ref={raiz}
      className="holo"
      aria-hidden="true"
      onPointerMove={seguir}
      onPointerDown={seguir}
      onPointerLeave={soltar}
      onPointerCancel={soltar}
      onPointerUp={(e) => { if (e.pointerType !== "mouse") soltar(); }}
    >
      <div ref={sombra} className="holo-sombra" />
      <div ref={tarjeta} className="holo-tarjeta">
        {children}
        <div className="holo-lamina" />
        <div className="holo-luz" />
      </div>
    </div>
  );
}
