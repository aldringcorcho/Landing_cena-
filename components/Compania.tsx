const EQUIPO = [
  {
    rol: "Dirección y dramaturgia",
    texto: "Diseña cada cena (los temas, los silencios, la despedida) y decide con el actor qué versión de ti se sienta a la mesa.",
  },
  {
    rol: "El elenco",
    texto: "Actores y actrices de 50 a 70 años formados en improvisación. Ensayan tu personaje durante una semana.",
  },
  {
    rol: "La cocina",
    texto: "Producto de temporada. Los platos llegan en las pausas de la conversación, sin interrumpirla.",
  },
];

export default function Compania() {
  return (
    <section id="compania">
      <div className="centro">
        <div className="compania-cabecera">
          <div>
            <p className="antetitulo">Quién está detrás</p>
            <h2>Compañía Sobremesa</h2>
          </div>
          <blockquote className="manifiesto">
            «Hacemos teatro para una sola persona porque las conversaciones importantes nunca tienen público.»
          </blockquote>
        </div>
        <p className="seccion-intro">
          Teatro inmersivo: el espectador no mira la obra, la protagoniza.
        </p>
        <div className="equipo">
          {EQUIPO.map((m) => (
            <article key={m.rol}>
              <h3>{m.rol}</h3>
              <p>{m.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
