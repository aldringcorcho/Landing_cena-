"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Scroll suave con inercia (Lenis) para la rueda del ratón y el trackpad.
// - Los enlaces del menú (#reservas, #menu…) también se desplazan suavemente.
// - En móvil se mantiene el scroll nativo del dedo, que ya es suave.
// - Las zonas con scroll propio (como los campos de texto del cuestionario) siguen funcionando.
// - Si la persona prefiere menos movimiento, no se activa y queda el scroll normal.
export default function ScrollSuave() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,              // cuanto más bajo, más largo y suave el deslizamiento
      anchors: { offset: -20 },
      allowNestedScroll: true,
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
