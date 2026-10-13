import Logo from "./Logo";

export default function Footer() {
  return (
    <footer id="contacto">
      <Logo className="logo-pie" />
      <p className="pie-horario">Jueves a sábado · pases a las 20:00 y 22:15</p>
      <p><a href="mailto:reservas@cenacontufuturoyo.com">reservas@cenacontufuturoyo.com</a></p>
      <p className="pie-legal">© 2026 Compañía Sobremesa · Proyecto de clase</p>
    </footer>
  );
}
