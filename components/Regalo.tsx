import { Simbolo } from "./Logo";
import TarjetaHolo from "./TarjetaHolo";

const CORREO = "reservas@cenacontufuturoyo.com";
const ASUNTO = encodeURIComponent("Quiero regalar una cena con su futuro yo");

const PASOS = [
  "Nos escribes y pagas la invitación.",
  "Te enviamos la tarjeta regalo, en papel o en PDF.",
  "Quien la recibe elige fecha en los seis meses siguientes.",
];

// Tarjeta regalo: segunda llamada a la acción, para quien quiere la experiencia para otra persona
export default function Regalo() {
  return (
    <section id="regalo">
      <div className="centro regalo">
        <div className="regalo-texto">
          <p className="antetitulo">¿Es para otra persona?</p>
          <h2>Regala una cena con su futuro yo</h2>
          <ol className="regalo-pasos">
            {PASOS.map((p) => <li key={p}>{p}</li>)}
          </ol>
          <a className="boton boton-grande" href={`mailto:${CORREO}?subject=${ASUNTO}`}>Regalar una cena · 95 €</a>
        </div>

        {/* La tarjeta regalo, dibujada como una entrada de teatro, con efecto holográfico */}
        <div className="tarjeta-regalo">
          <TarjetaHolo>
            <div className="tarjeta-regalo-cuerpo">
              <Simbolo className="tarjeta-regalo-simbolo" />
              <span className="tarjeta-regalo-tipo">Invitación</span>
              <span className="tarjeta-regalo-titulo">Cena con tu futuro yo</span>
              <span className="tarjeta-regalo-para">Para: alguien que todavía no se conoce</span>
            </div>
            <div className="tarjeta-regalo-talon">
              <span>Válida 6 meses</span>
              <span>Nº 0412</span>
            </div>
          </TarjetaHolo>
        </div>
      </div>
    </section>
  );
}
