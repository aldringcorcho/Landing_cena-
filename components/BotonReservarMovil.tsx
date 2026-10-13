"use client";

import { useEffect, useState } from "react";

// Botón "Reservar" fijo abajo, solo en móvil (el CSS lo oculta en pantallas anchas).
// Aparece al dejar atrás el hero y se esconde mientras se ven Reservas o Regalo (ahí ya está
// el formulario) y al llegar al pie de página, para no tapar contenido.
export default function BotonReservarMovil() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const estado = { pasadoHero: false, ocultar: new Set<string>() };
    const actualizar = () => setVisible(estado.pasadoHero && estado.ocultar.size === 0);

    const hero = document.getElementById("inicio");
    const observaHero = new IntersectionObserver(([e]) => {
      estado.pasadoHero = !e.isIntersecting;
      actualizar();
    });
    if (hero) observaHero.observe(hero);

    const observaZonas = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => (e.isIntersecting ? estado.ocultar.add(e.target.id) : estado.ocultar.delete(e.target.id)));
      actualizar();
    });
    ["reservas", "regalo", "contacto"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observaZonas.observe(el);
    });

    return () => {
      observaHero.disconnect();
      observaZonas.disconnect();
    };
  }, []);

  return (
    <a
      href="#reservas"
      className={visible ? "reservar-movil visible" : "reservar-movil"}
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
    >
      Reservar mi pase · 95 €
    </a>
  );
}
