import VideoVela from "./VideoVela";

const TITULO = "Cena con tu futuro yo";

export default function Hero() {
  // La cinta repite el título; se duplica para que el desplazamiento sea continuo
  const grupo = (
    <div className="grupo">
      <span>{TITULO}</span><i className="punto" />
      <span>{TITULO}</span><i className="punto" />
    </div>
  );

  return (
    <header id="inicio" className="hero">
      <div className="hero-contenido">
        <h1 className="oculto">{TITULO}</h1>
        <div className="cinta" aria-hidden="true">
          <div className="pista">{grupo}{grupo}</div>
        </div>

        {/* Debajo de la cinta: texto a la izquierda, vídeo de la vela a la derecha */}
        <div className="hero-fila">
          <div className="hero-texto">
            <p className="subtitulo">Teatro experimental para una sola persona</p>
            <p className="hero-apoyo">Una cena privada con un actor que interpreta a tu yo de dentro de treinta años.</p>
            <div className="hero-acciones">
              <a className="boton boton-grande" href="#reservas">Reservar mi pase</a>
              <a className="enlace-secundario" href="#regalo">o regálasela a alguien</a>
            </div>
          </div>
          <VideoVela />
        </div>
      </div>
    </header>
  );
}
