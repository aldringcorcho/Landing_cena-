"use client";

import { useEffect } from "react";

// Aparición suave al hacer scroll: títulos, tarjetas y fotos entran con un leve fundido y
// desplazamiento hacia arriba cuando llegan a la pantalla. Los elementos hermanos entran
// escalonados. La frase gancho del concepto aparece palabra a palabra.
//
// - Solo se preparan los elementos que aún no están a la vista al cargar: lo que ya se ve
//   no parpadea ni desaparece.
// - Con "reducir movimiento" no se hace nada y todo se ve directamente.
// - La animación (globals.css) usa fill "backwards", así no bloquea los efectos al pasar
//   el ratón que algunos de estos elementos tienen.

const SELECTORES = [
  "section h2",
  ".seccion-intro",
  ".menu-intro",
  ".concepto-texto",
  ".antetitulo",
  ".manifiesto",
  ".glow",
  ".datos li",
  ".aviso",
  ".carta",
  ".foto",
  ".equipo > article",
  ".vidrio",
  ".regalo-pasos li",
  ".regalo .boton",
  ".holo",
  "#preguntas details",
  "footer .logo",
].join(",");

export default function Revelado() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fueraDePantalla = (el: Element) => el.getBoundingClientRect().top > innerHeight * 0.95;

    const observador = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("visible");
          observador.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -8% 0px" }
    );

    // Elementos que aparecen con fundido; si uno ya está dentro de otro que aparece, no se duplica
    document.querySelectorAll<HTMLElement>(SELECTORES).forEach((el) => {
      if (!fueraDePantalla(el) || el.parentElement?.closest(".revelar")) return;
      // Escalonado entre hermanos: cada uno empieza un poco después que el anterior
      const hermanos = [...(el.parentElement?.children ?? [])].filter((h) => h.matches(SELECTORES));
      el.style.setProperty("--retraso", `${Math.min(hermanos.indexOf(el), 5) * 0.09}s`);
      el.classList.add("revelar");
      observador.observe(el);
    });

    // La frase gancho, palabra a palabra. A diferencia del resto, se repite cada vez que vuelve
    // a la pantalla: al salir del todo se "apaga" y al entrar de nuevo las palabras reaparecen.
    const gancho = document.querySelector(".gancho");
    const observaGancho = new IntersectionObserver(
      ([e]) => e.target.classList.toggle("visible", e.isIntersecting),
      { rootMargin: "0px 0px -8% 0px" }
    );
    if (gancho) {
      gancho.classList.add("revelar-palabras");
      observaGancho.observe(gancho);
    }

    return () => {
      observador.disconnect();
      observaGancho.disconnect();
    };
  }, []);

  return null;
}
