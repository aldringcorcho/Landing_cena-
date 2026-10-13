"use client";

import { useEffect, useState } from "react";
import { Simbolo } from "./Logo";

const ENLACES = [
  { id: "inicio", texto: "Inicio", icono: "M12 3 2 11.5h3V21h5.5v-6h3v6H19v-9.5h3z" },
  { id: "experiencia", texto: "Cómo funciona", icono: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm1 3v4.6l3.4 3.4-1.4 1.4L11 12.4V7z" },
  { id: "menu", texto: "Menú", icono: "M6 2h1.5v6.5H9V2h1.5v6.5H12V2h1.5v7.5a3 3 0 0 1-3 3V22h-3v-9.5a3 3 0 0 1-3-3V2zM18.5 2c1.4 0 2.5 2.7 2.5 7v4h-2v9h-3V7c0-3 1-5 2.5-5z" },
  { id: "compania", texto: "La compañía", icono: "M9 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 2c3.3 0 7 1.6 7 4.5V20H2v-2.5C2 14.6 5.7 13 9 13zm8-2.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm1 2.4c2.3.4 4 1.7 4 3.6V20h-4v-2.5c0-1.7-.7-3.1-1.8-4.1z" },
  { id: "reservas", texto: "Reservar", icono: "M7 2h2v2h6V2h2v2h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3zM5 9v10h14V9zm2 2h4v4H7z" },
  { id: "preguntas", texto: "Preguntas", icono: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm-1.2 14v2.3h2.4V16zM12 5.7c-2.2 0-3.8 1.4-3.9 3.6h2.3c.1-1 .7-1.6 1.6-1.6.9 0 1.5.6 1.5 1.4 0 .7-.3 1.1-1.2 1.7-1.1.7-1.6 1.5-1.5 2.9v.4h2.3v-.3c0-.8.3-1.2 1.2-1.8 1.1-.7 1.7-1.6 1.7-2.9 0-2-1.6-3.4-4-3.4z" },
];

// Efecto "relleno desde el origen" (inspirado en Origin Button): un círculo dorado nace en el punto
// por donde entra el cursor y crece hasta cubrir el botón; al salir, se encoge hacia el punto de salida.
// El JS solo calcula ese punto y el diámetro necesario; la animación la hace el CSS (nav a::before).
function diametroCobertura(ancho: number, alto: number, x: number, y: number) {
  // Distancia del punto a la esquina más lejana, por dos: así el círculo siempre tapa todo el botón
  return Math.ceil(2 * Math.max(Math.hypot(x, y), Math.hypot(ancho - x, y), Math.hypot(x, alto - y), Math.hypot(ancho - x, alto - y)));
}

function colocarOrigen(enlace: HTMLElement, x: number, y: number) {
  const r = enlace.getBoundingClientRect();
  enlace.style.setProperty("--ox", `${x}px`);
  enlace.style.setProperty("--oy", `${y}px`);
  enlace.style.setProperty("--d", `${diametroCobertura(r.width, r.height, x, y)}px`);
}

function desdeCursor(e: React.PointerEvent<HTMLAnchorElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  colocarOrigen(e.currentTarget, e.clientX - r.left, e.clientY - r.top);
}

// Se usa un atributo data- y no una clase porque React reescribe className al cambiar la sección activa
const rellenar = (e: React.PointerEvent<HTMLAnchorElement>) => { desdeCursor(e); e.currentTarget.dataset.relleno = ""; };
const vaciar = (e: React.PointerEvent<HTMLAnchorElement>) => { desdeCursor(e); delete e.currentTarget.dataset.relleno; };
// Con teclado (Tab), el círculo nace desde el centro del botón
const enfocar = (e: React.FocusEvent<HTMLAnchorElement>) => {
  if (!e.currentTarget.matches(":focus-visible")) return;
  const r = e.currentTarget.getBoundingClientRect();
  colocarOrigen(e.currentTarget, r.width / 2, r.height / 2);
  e.currentTarget.dataset.relleno = "";
};
const desenfocar = (e: React.FocusEvent<HTMLAnchorElement>) => { delete e.currentTarget.dataset.relleno; };

export default function Nav() {
  const [activo, setActivo] = useState("inicio");

  // Marca en el menú la sección que ocupa el centro de la pantalla
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && setActivo(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ENLACES.forEach(({ id }) => {
      const seccion = document.getElementById(id);
      if (seccion) observador.observe(seccion);
    });
    return () => observador.disconnect();
  }, []);

  return (
    <>
      {/* Marca arriba a la izquierda (solo en pantallas anchas) */}
      <a className="marca" href="#inicio" aria-label="Cena con tu futuro yo, volver al inicio">
        <Simbolo className="marca-simbolo" />
        <span>Cena con tu futuro yo</span>
      </a>

      {/* Menú: botones de cristal arriba a la derecha */}
      <nav aria-label="Menú">
        <ul>
          {ENLACES.map(({ id, texto, icono }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activo === id ? "activo" : undefined}
                aria-current={activo === id ? "true" : undefined}
                onPointerEnter={rellenar}
                onPointerLeave={vaciar}
                onFocus={enfocar}
                onBlur={desenfocar}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icono} /></svg>
                <span>{texto}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
