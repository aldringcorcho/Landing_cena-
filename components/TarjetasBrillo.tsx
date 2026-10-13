"use client";

import { useEffect, useRef } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className: string;
  /** Qué elementos de dentro reciben el brillo. Por defecto, las tarjetas .glow */
  selector?: string;
}

// Contenedor de elementos con brillo que sigue al cursor. Se usa en "Cómo funciona", en
// "La compañía" y en las entradas de fecha de Reservas.
// Escribe en cada elemento la posición del cursor relativa a él (--x, --y) y en el contenedor
// la posición horizontal en pantalla (--xp, de 0 a 1), que decide el tono del brillo.
// Para no gastar recursos: solo escucha el ratón mientras el contenedor está en pantalla y
// actualiza como mucho una vez por fotograma.
export default function TarjetasBrillo({ className, selector = ".glow", children, ...resto }: Props) {
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contenedor.current;
    if (!el) return;
    let cursor: { x: number; y: number } | null = null;
    let raf = 0;

    const pintar = () => {
      raf = 0;
      if (!cursor) return;
      el.style.setProperty("--xp", (cursor.x / innerWidth).toFixed(3));
      el.querySelectorAll<HTMLElement>(selector).forEach((item) => {
        const r = item.getBoundingClientRect();
        item.style.setProperty("--x", (cursor!.x - r.left).toFixed(1));
        item.style.setProperty("--y", (cursor!.y - r.top).toFixed(1));
      });
    };
    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cursor = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(pintar);
    };
    // Al hacer scroll con el ratón quieto, los elementos se mueven bajo el cursor: se recalcula
    const desplazar = () => { if (cursor && !raf) raf = requestAnimationFrame(pintar); };

    const observador = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        addEventListener("pointermove", mover, { passive: true });
        addEventListener("scroll", desplazar, { passive: true });
      } else {
        removeEventListener("pointermove", mover);
        removeEventListener("scroll", desplazar);
      }
    });
    observador.observe(el);

    return () => {
      observador.disconnect();
      removeEventListener("pointermove", mover);
      removeEventListener("scroll", desplazar);
      cancelAnimationFrame(raf);
    };
  }, [selector]);

  return <div className={className} ref={contenedor} {...resto}>{children}</div>;
}
