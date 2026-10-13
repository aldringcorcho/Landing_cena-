# Cena con tu futuro yo · Documento de marca y proyecto

## El problema

Las decisiones importantes se toman pensando en el futuro, pero casi nunca tenemos ocasión de hablar con él. Las personas entre 25 y 45 años viven un momento de muchas elecciones (trabajo, pareja, ciudad, hijos) y pocas experiencias culturales les invitan a pararse a pensar en ellas sin que suene a terapia o a autoayuda.

## La solución

Una función de teatro inmersivo para una sola persona: una cena privada con un actor que interpreta a tu yo de dentro de treinta años. Antes de la función respondes un cuestionario; el actor construye su personaje a partir de tus respuestas y durante la cena improvisa contigo.

## Nombre e identidad

| Elemento | Decisión |
|---|---|
| **Nombre de la experiencia** | *Cena con tu futuro yo*: describe exactamente lo que ocurre y despierta curiosidad sin explicarlo todo |
| **Compañía** | *Compañía Sobremesa*: la sobremesa es la conversación que llega cuando ya se ha terminado de comer, que es justo lo que ofrece la función |
| **Logotipo** | Un plato visto desde arriba con una llama en el centro. El plato es la cena, la llama es la vela que alumbra la conversación y la marca en lo alto del borde recuerda la aguja de un reloj: el paso del tiempo |
| **Favicon** | El mismo símbolo, en dorado y ámbar sobre fondo noche |

## Público objetivo

- **Principal:** personas de 25 a 45 años, urbanas, que consumen cultura (teatro, cine de autor, podcasts) y valoran las experiencias por encima de los objetos. Están en un momento de cambio o de decisiones.
- **Secundario:** quien busca un regalo original y significativo para alguien cercano (cumpleaños, una despedida, el final de una etapa).

## Propuesta de valor

> Una conversación que no puedes tener con nadie más: con la persona que serás.

- Es **íntima**: una sola persona y una sala privada.
- Es **personal**: la función se construye con tus propias respuestas.
- Es **teatro, no terapia**: no predice el futuro, te propone una posibilidad para pensar tu vida desde otro sitio.
- Es **también una cena de verdad**: tres pases de temporada con bebida incluida.

## Tono de comunicación

- **Cercano y tranquilo**, con tuteo. Frases cortas y claras.
- **Evocador, pero honesto**: crea misterio ("Tú todavía no la conoces") y a la vez explica sin rodeos qué es y qué no es ("Esto es teatro. No es una sesión de terapia").
- **Sin exageraciones ni promesas de transformación.** La experiencia se cuenta a sí misma.

## Arquitectura de información

La página recorre una noche de cena, de la oscuridad a la mañana siguiente. Cada bloque de color corresponde a un momento:

| Banda | Sección | Para qué sirve |
|---|---|---|
| Noche | **Hero** | Nombre, promesa en una frase y llamada a reservar (y a regalar) |
| Noche | **El concepto** | El gancho emocional: imaginar la cena |
| Vino | **Cómo funciona** | Tres pasos, datos clave (90 min, 3 platos, 95 €) y el aviso "esto es teatro" |
| Vino | **El menú** | Recordar que también es una experiencia culinaria |
| Vino | **Galería** | Mostrar el espacio y la atmósfera |
| Vino | **La compañía** | Confianza: quién hay detrás y cómo trabaja |
| Luz de vela | **Reservas** | Conversión: fecha, datos y cuestionario en una tarjeta de cristal |
| Luz de vela | **Regala una cena** | Segunda conversión, para el público secundario |
| Mañana | **Preguntas frecuentes** | Resolver las últimas dudas |
| Mañana | **Pie de página** | Logotipo, horarios y contacto |

## Dirección artística

**Paleta "Sobremesa"** (de la noche de la cena a la mañana siguiente):

| Nombre | Color | Uso |
|---|---|---|
| Noche | `#14101A` | Hero y concepto |
| Vino | `#4A1F2B` | Experiencia, menú, galería y compañía |
| Luz de vela | `#E8C9A0` | Reservas y regalo |
| Mañana | `#F3EDE2` | Preguntas y pie |
| Dorado / Ámbar / Burdeos / Rosa | `#CDB998` `#E0A96D` `#7A2E3A` `#B5838D` | Acentos de cada banda |

Las bandas se funden entre sí con degradados largos mezclados en OKLab, con un grano muy fino encima para evitar bandas de color.

**Tipografía:**
- *Cormorant Garamond* (títulos, frase gancho, logotipo): serif clásica, como un programa de teatro o una carta de restaurante.
- *Jost* (texto, formulario, botones): sans geométrica, limpia y legible.
- *Bebas Neue* (cinta del título y números): letra de cartel de teatro.

**Recursos visuales:** efecto *liquid glass* en el menú y en el formulario, tarjetas con brillo que sigue al cursor, entradas de teatro troqueladas para elegir fecha, una tarjeta regalo dibujada como entrada, vídeo de una vela encendida en el hero y esquinas redondeadas en todos los elementos.

## Recursos gráficos y audiovisuales

- Vídeo de la vela (hero): `public/videos/vela.webm` (600 KB) con su imagen de carga `vela-poster.jpg`.
- Galería: cinco fotografías de la experiencia en `public/Imagenes/` (WebP), servidas en AVIF/WebP optimizado por Next.js.

## Llamadas a la acción

1. **Reservar mi pase** (hero) → formulario de reservas.
2. **o regálasela a alguien** (hero) → sección de regalo.
3. **Reservar por 95 €** (final del formulario).
4. **Regalar una cena · 95 €** (sección regalo) → correo a la compañía.

## Experiencia responsive

- **Escritorio:** marca arriba a la izquierda y menú con texto arriba a la derecha. Hero en dos columnas (texto y vídeo), galería en mosaico de tres columnas.
- **Tablet y móvil (menos de 860 px):** menú solo con iconos y centrado, todo en una columna, galería en dos columnas y después en una. Los textos se centran.
- **Accesibilidad:** navegación con teclado, estados de foco visibles, etiquetas para lectores de pantalla y respeto de la preferencia de "reducir movimiento" (las animaciones y el vídeo se detienen).

## Stack

React + Next.js (App Router) + TypeScript, preparado para GitHub y Vercel. Ver `README.md`.
