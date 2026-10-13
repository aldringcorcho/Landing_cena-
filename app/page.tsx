import Nav from "@/components/Nav";
import FondoNeuro from "@/components/FondoNeuro";
import ScrollSuave from "@/components/ScrollSuave";
import Revelado from "@/components/Revelado";
import BotonReservarMovil from "@/components/BotonReservarMovil";
import Hero from "@/components/Hero";
import Concepto from "@/components/Concepto";
import Proceso from "@/components/Proceso";
import Menu from "@/components/Menu";
import Galeria from "@/components/Galeria";
import Compania from "@/components/Compania";
import Reservas from "@/components/Reservas";
import Regalo from "@/components/Regalo";
import Preguntas from "@/components/Preguntas";
import Footer from "@/components/Footer";

// Arquitectura: la página recorre una noche de cena, de la oscuridad a la mañana siguiente.
// Cada "banda" tiene su color y se funde con la siguiente (ver globals.css).
export default function Inicio() {
  return (
    <>
      <ScrollSuave />
      <Revelado />
      <BotonReservarMovil />
      <Nav />

      {/* Banda 1 · Noche: la promesa */}
      <div className="banda-1">
        <Hero />
        <Concepto />
      </div>

      {/* Banda 2 · Vino: cómo es la experiencia */}
      <div className="banda-2">
        <Proceso />
        <Menu />
        <Galeria />
        <Compania />
      </div>

      {/* Banda 3 · Luz de vela: la acción */}
      <div className="banda-3">
        {/* Un solo shader "Neuro Noise" detrás de Reservas y Regalo: la red de filamentos es continua */}
        <FondoNeuro />
        <Reservas />
        <Regalo />
      </div>

      {/* Banda 4 · Mañana siguiente: dudas y contacto */}
      <div className="banda-4">
        <Preguntas />
        <Footer />
      </div>
    </>
  );
}
