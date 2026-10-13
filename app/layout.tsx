import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

// Tipografía: serif elegante para títulos, sans limpia para leer y la de cartel para la cinta.
// next/font las descarga al compilar y las sirve desde el propio dominio (sin peticiones a Google).
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
// Solo los pesos que usa la web (el 300 no se usa en ningún sitio: era un archivo de fuente de más)
const sans = Jost({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans", display: "swap" });
const cartel = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-cartel", display: "swap" });

// Dominio público para las imágenes al compartir en redes. En Vercel se rellena solo.
const dominio = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(dominio),
  title: "Cena con tu futuro yo · Teatro experimental para una sola persona",
  description:
    "Una cena privada con un actor que interpreta a tu yo de dentro de treinta años. Teatro inmersivo de la Compañía Sobremesa.",
  openGraph: {
    title: "Cena con tu futuro yo",
    description: "Una cena privada con un actor que interpreta a tu yo de dentro de treinta años.",
    images: ["/videos/vela-poster.jpg"],
    locale: "es_ES",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#14101a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable} ${cartel.variable}`}>
      <body>{children}</body>
    </html>
  );
}
