const PREGUNTAS = [
  { p: "¿Tengo que saber actuar?", r: "No. Tú solo cenas y hablas; el teatro lo pone el actor." },
  { p: "¿Puedo ir con alguien?", r: "No. La función es para una sola persona." },
  { p: "¿Se puede regalar?", r: "Sí, con una tarjeta regalo válida seis meses. Lo explicamos en «Regala una cena»." },
  { p: "¿Qué pasa con mis respuestas después?", r: "Las borramos una semana después de la función." },
  { p: "¿Puedo cambiar la fecha?", r: "Sí, hasta 72 horas antes, si hay plaza." },
  { p: "¿Y si tengo alergias o no como carne?", r: "Hay opción vegetal y adaptamos el menú a lo que nos indiques en el cuestionario." },
];

export default function Preguntas() {
  return (
    <section id="preguntas">
      <div className="estrecho">
        <h2>Preguntas frecuentes</h2>
        {PREGUNTAS.map(({ p, r }) => (
          <details key={p}>
            <summary>{p}</summary>
            <p>{r}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
