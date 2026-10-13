# Cena con tu futuro yo

Landing de una función de teatro inmersivo para una sola persona: una cena privada con un actor que interpreta a tu yo de dentro de treinta años.

Las decisiones de marca, público, tono y diseño están en [MARCA.md](MARCA.md).

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + React 19
- TypeScript
- CSS propio (sin framework), en `app/globals.css`
- Fuentes con `next/font` (Cormorant Garamond, Jost y Bebas Neue), servidas desde el propio dominio
- [Lenis](https://lenis.darkroom.engineering) para el scroll suave
- Shader WebGL (sin librerías) para el fondo de Reservas: "Neuro Noise", adaptado de [Paper Shaders](https://shaders.paper.design/neuro-noise) (Apache-2.0), en `components/FondoNeuro.tsx`

## Arrancar en local

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run dev:movil` | Igual, pero accesible desde el móvil en la misma Wi-Fi: abre `http://IP-DEL-ORDENADOR:3000` |
| `npm run build` | Compila la versión de producción |
| `npm run start` | Sirve la versión compilada |
| `npm run typecheck` | Revisa los tipos de TypeScript |

## Estructura

```
app/
  layout.tsx        Fuentes, metadatos (título, descripción, redes) y <html>
  page.tsx          Orden de las secciones y bandas de color
  globals.css       Todos los estilos
  icon.svg          Favicon
components/
  Nav.tsx           Marca y menú fijo (marca la sección visible)
  Hero.tsx          Cinta del título, texto y vídeo de la vela
  Concepto.tsx      Frase gancho
  Proceso.tsx       Cómo funciona (tarjetas con brillo)
  Menu.tsx          Menú desplegable de tres pases
  Galeria.tsx       Mosaico de escenas
  Compania.tsx      La compañía y el equipo
  Reservas.tsx      Formulario: fechas, datos y cuestionario
  Regalo.tsx        Tarjeta regalo
  Preguntas.tsx     Preguntas frecuentes
  Footer.tsx        Pie con logotipo y contacto
  Logo.tsx          Logotipo y símbolo en SVG
lib/
  temporada.ts      Fechas de la temporada y plazas libres (datos de ejemplo)
public/
  videos/           Vídeo del hero en WebM y su imagen de carga
_referencia/
  index.html        Versión anterior en HTML, solo como referencia
```

## Cambios habituales

- **Fotos de la galería:** guárdalas en `public/Imagenes/` (en formato WebP) y pon su ruta en el campo `src` de cada escena en `components/Galeria.tsx`.
- **Fechas y plazas:** `lib/temporada.ts`. Las plazas ocupadas son de ejemplo hasta que haya un sistema de reservas real.
- **Colores y tipografía:** variables al principio de `app/globals.css`.
- **Tamaño del vídeo del hero:** `--video-ancho` en la regla `.hero-fila` de `app/globals.css`.

## Publicar en GitHub y Vercel

1. Crea un repositorio vacío en GitHub.
2. En esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "Landing Cena con tu futuro yo"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```
3. En [vercel.com](https://vercel.com) → *Add New… → Project* → importa el repositorio. Vercel detecta Next.js solo; pulsa *Deploy*.

Cada `git push` a `main` vuelve a publicar la web automáticamente.

> El vídeo original `Videos/Vela.mp4` (11 MB) está en `.gitignore`: la web solo usa la versión WebM de `public/videos/`.
