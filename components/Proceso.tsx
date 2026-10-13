import TarjetasBrillo from "./TarjetasBrillo";

const PASOS = [
  {
    titulo: "Reservas y respondes",
    texto: "Rellenas un cuestionario corto sobre tu vida y lo que quieres conseguir. Solo lo lee el equipo.",
  },
  {
    titulo: "Preparamos tu personaje",
    texto: "El actor construye una versión posible de ti: cómo hablarías, qué recordarías, qué habrías cambiado.",
  },
  {
    titulo: "Vienes a cenar",
    texto: "Sala privada, tres platos y noventa minutos de conversación. Sin guion: todo depende de lo que preguntes.",
  },
];

const DATOS = [
  { cifra: "1 + 1", texto: "tú y el actor" },
  { cifra: "90 min", texto: "de función" },
  { cifra: "3 platos", texto: "bebida incluida" },
  { cifra: "95 €", texto: "por persona" },
];

export default function Proceso() {
  return (
    <section id="experiencia">
      <div className="centro">
        <h2>Cómo funciona</h2>
        <TarjetasBrillo className="pasos">
          {PASOS.map((paso, i) => (
            <article className="glow" key={paso.titulo}>
              <div className="glow-halo" aria-hidden="true" />
              <div className="num">{i + 1}</div>
              <h3>{paso.titulo}</h3>
              <p>{paso.texto}</p>
            </article>
          ))}
        </TarjetasBrillo>
        <ul className="datos">
          {DATOS.map((d) => (
            <li key={d.cifra}><b>{d.cifra}</b><span>{d.texto}</span></li>
          ))}
        </ul>
      </div>
      <div className="estrecho">
        <div className="aviso">
          <h2>Antes de reservar</h2>
          <p>
            Esto es teatro, no terapia. Nadie te dirá cómo será tu futuro: el actor interpreta una posibilidad para que
            mires tu vida desde otro sitio.
          </p>
        </div>
      </div>
    </section>
  );
}
