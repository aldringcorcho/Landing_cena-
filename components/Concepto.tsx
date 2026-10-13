// Divide un texto en palabras para que aparezcan una a una (ver .revelar-palabras en globals.css).
// Los espacios quedan como texto normal entre las palabras, así se lee igual sin animación.
function palabras(texto: string, inicio: number) {
  return texto.split(" ").flatMap((p, i) => [
    i > 0 ? " " : null,
    <span className="palabra" style={{ "--i": inicio + i } as React.CSSProperties} key={inicio + i}>{p}</span>,
  ]);
}

const FRASE = "Imagina sentarte a cenar frente a la persona que serás dentro de treinta años.";
const REMATE = "Te conoce mejor que nadie. Tú todavía no la conoces.";

export default function Concepto() {
  return (
    <section id="concepto" className="concepto">
      <div className="centro">
        <p className="gancho">
          {palabras(FRASE, 0)}{" "}
          <em>{palabras(REMATE, FRASE.split(" ").length)}</em>
        </p>
      </div>
      <div className="estrecho">
        <p className="concepto-texto">
          Un actor interpreta a tu yo de dentro de treinta años. Conoce tu vida por el cuestionario que rellenas; el
          resto se improvisa en la cena.
        </p>
      </div>
    </section>
  );
}
