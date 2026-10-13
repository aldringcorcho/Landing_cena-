"use client";

// Lista de platos del menú con efecto parallax al pasar el ratón.
// Escribe en el plato que está bajo el cursor su posición relativa (--mx, --my, de -1 a 1);
// el CSS (.platos en globals.css) inclina la tarjeta y desplaza cada capa según esos valores.
export default function PlatosParallax({ children }: { children: React.ReactNode }) {
  const mover = (e: React.PointerEvent<HTMLOListElement>) => {
    if (e.pointerType !== "mouse") return;
    const plato = (e.target as HTMLElement).closest<HTMLElement>("li");
    if (!plato) return;
    const r = plato.getBoundingClientRect();
    plato.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    plato.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    plato.classList.add("siguiendo");
  };

  // Al salir de un plato, vuelve a su posición con la transición lenta del CSS
  const salir = (e: React.PointerEvent<HTMLOListElement>) => {
    const plato = (e.target as HTMLElement).closest<HTMLElement>("li");
    if (!plato || plato.contains(e.relatedTarget as Node)) return;
    plato.classList.remove("siguiendo");
    plato.style.setProperty("--mx", "0");
    plato.style.setProperty("--my", "0");
  };

  return (
    <ol className="platos" onPointerMove={mover} onPointerOut={salir}>
      {children}
    </ol>
  );
}
