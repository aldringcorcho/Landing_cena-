import Image from "next/image";

// Fotos de la galería. Para poner una foto, guárdala en public/Imagenes/ y escribe su ruta
// en "src" (por ejemplo "/Imagenes/sala.webp", con la misma mayúscula que la carpeta). Mientras "src" esté vacío se muestra una
// ilustración con el color y el icono de la escena.
interface Foto {
  titulo: string;
  texto: string;
  src?: string;
  icono: string;        // trazo SVG (viewBox 0 0 48 48)
  tono: string;         // color del resplandor de la ilustración
  grande?: boolean;     // ocupa dos filas
  ancha?: boolean;      // ocupa todo el ancho (cierra el mosaico sin huecos)
}

// El orden importa para que el mosaico no tenga huecos (3 columnas):
//   La sala (alta) | El primer pase   | La sobremesa (alta)
//   La sala        | Antes de entrar  | La sobremesa
//   La salida (todo el ancho)
const FOTOS: Foto[] = [
  { titulo: "La sala", texto: "Un comedor privado para dos, sin público.", tono: "224,169,109", grande: true,
    src: "/Imagenes/sala-luminosa.webp",
    icono: "M6 40h36M10 40V22l14-10 14 10v18M20 40v-9h8v9" },
  { titulo: "El primer pase", texto: "Cada plato abre un tema.", tono: "181,131,141",
    src: "/Imagenes/primer-pase.webp",
    icono: "M24 10a14 14 0 1 1 0 28 14 14 0 0 1 0-28zm0 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM4 14v20M44 14v20" },
  { titulo: "La sobremesa", texto: "Cuando llega el café, llegan las preguntas.", tono: "224,169,109", grande: true,
    src: "/Imagenes/sobremesa.webp",
    icono: "M12 18h20v10a10 10 0 0 1-20 0zM32 21h4a4 4 0 0 1 0 8h-4M18 6c0 3-2 3-2 6M24 6c0 3-2 3-2 6M8 42h28" },
  { titulo: "Antes de entrar", texto: "El vestíbulo, justo antes de que empiece la función.", tono: "122,46,58",
    src: "/Imagenes/vestibulo.webp",
    icono: "M14 6h20v36H14zM19 14h10M19 20h10M19 26h6" },
  { titulo: "La salida", texto: "Sales a la calle con algo que pensar.", tono: "205,185,152", ancha: true,
    src: "/Imagenes/salida.webp",
    icono: "M14 42V6h20v36M26 24h2M6 42h36" },
];

export default function Galeria() {
  return (
    <section id="galeria">
      <div className="centro">
        <h2>La experiencia, en imágenes</h2>
        <p className="seccion-intro">Una sola sala, íntima y luminosa, solo para ti.</p>
        <ul className="galeria">
          {FOTOS.map((f) => (
            <li
              key={f.titulo}
              className={["foto", f.grande && "foto-grande", f.ancha && "foto-ancha"].filter(Boolean).join(" ")}
              style={{ "--tono": f.tono } as React.CSSProperties}
            >
              {f.src ? (
                <Image
                  src={f.src}
                  alt={`${f.titulo}: ${f.texto}`}
                  fill
                  // Ancho real de cada casilla, para que el navegador descargue la versión justa
                  sizes={f.ancha ? "(max-width: 1180px) 100vw, 1140px" : "(max-width: 520px) 100vw, (max-width: 860px) 50vw, 380px"}
                />
              ) : (
                <svg className="foto-icono" viewBox="0 0 48 48" aria-hidden="true">
                  <path d={f.icono} />
                </svg>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
