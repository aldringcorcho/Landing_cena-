import PlatosParallax from "./PlatosParallax";

const PLATOS = [
  { pase: "I · Entrante", nombre: "El presente", descripcion: "Crema de calabaza asada con aceite de avellana y pan de masa madre." },
  { pase: "II · Principal", nombre: "Lo que vendrá", descripcion: "Carrillera al vino tinto con puré de patata ahumada. Opción vegetal: risotto de setas." },
  { pase: "III · Postre", nombre: "Lo que recordarás", descripcion: "Torrija caramelizada con helado de vainilla, como las de antes." },
];

// Tarjeta desplegable con los tres pases apilados
export default function Menu() {
  return (
    <section id="menu">
      <div className="estrecho">
        <h2>El menú</h2>
        <p className="menu-intro">
          También es una cena de verdad: tres pases de temporada, cada uno ligado a un momento de la conversación.
        </p>
        <details className="carta">
          <summary>
            <span className="carta-titulo">Menú de la función</span>
            <span className="carta-accion">Ver los tres pases</span>
          </summary>
          {/* Los platos tienen efecto parallax al pasar el ratón */}
          <PlatosParallax>
            {PLATOS.map((p) => (
              <li key={p.pase}>
                <span className="pase">{p.pase}</span>
                <h3>{p.nombre}</h3>
                <p>{p.descripcion}</p>
              </li>
            ))}
          </PlatosParallax>
          <p className="carta-nota">Incluye una copa de vino o bebida sin alcohol y café.</p>
        </details>
      </div>
    </section>
  );
}
