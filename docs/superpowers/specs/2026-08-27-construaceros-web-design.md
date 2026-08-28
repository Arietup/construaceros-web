# Construaceros Web — Diseño

Fecha: 2026-08-27
Estado: aprobado por el cliente (Dario Estupiñán), pendiente de plan de implementación

## 1. Contexto

Construaceros es una empresa ecuatoriana con más de 20 años de experiencia en
trabajos de acero inoxidable, hierro y vidrio, y en construcción civil
(mausoleos, casas, edificios, departamentos). Trabaja a nivel nacional y tiene
un nivel alto de satisfacción entre sus clientes. Hoy no tiene presencia
digital.

Este sitio persigue tres objetivos de negocio y uno personal:

1. Dar confianza a quien está evaluando contratar una obra.
2. Atraer clientes nuevos que buscan en Google.
3. Diferenciar a la empresa en un mercado donde casi nadie tiene una buena
   presentación digital.
4. Servir como pieza de portafolio del desarrollador.

Los cuatro objetivos apuntan en la misma dirección, salvo en un punto de
tensión que este documento resuelve explícitamente: el impulso a impresionar
técnicamente no puede degradar la experiencia de un cliente potencial con un
celular modesto y datos móviles. Cuando ambos entran en conflicto, gana el
cliente.

## 2. Alcance

### Incluido

- Landing page en español con todo el recorrido de venta.
- Portafolio de obras con una página propia por obra.
- Escena 3D en el hero.
- Formulario de contacto que envía correo, más WhatsApp y teléfono.
- SEO técnico y datos estructurados.
- Despliegue en Render.

### Excluido

- Panel de administración, base de datos y autenticación. El contenido lo
  edita el desarrollador en el repositorio.
- Versión en inglés. El público objetivo es ecuatoriano.
- Blog, cotizador en línea, chat en vivo, analítica de terceros.
- Testimonios de clientes: no hay material aún. La sección se añadirá cuando
  exista, y no forma parte de este alcance.

## 3. Stack

| Pieza | Elección | Razón |
|---|---|---|
| Framework | Astro 5 | Genera HTML real; el JavaScript se limita a las islas que lo necesitan |
| Estilos | Tailwind CSS 4 (vía `@tailwindcss/vite`) | Requisito del cliente |
| Lenguaje | TypeScript | Valida el contenido en tiempo de build |
| 3D | React Three Fiber + drei, en isla React | Único punto donde se carga React |
| Animación | IntersectionObserver + CSS; Motion solo dentro de islas React | No añade peso a páginas que no lo necesitan |
| Imágenes | `astro:assets` | AVIF/WebP, `srcset` y lazy loading automáticos |
| Formulario | Web3Forms | Envía correo sin backend |
| Hosting | Render Static Site | Gratis, CDN, HTTPS, sin cold start |

### Por qué el sitio es estático

En el plan gratuito de Render un servicio Node se suspende por inactividad y
tarda alrededor de 50 segundos en despertar. Un cliente potencial que llega
desde Google no espera 50 segundos. Un sitio estático se sirve desde CDN y no
se suspende nunca. Esta restricción es la que descarta cualquier diseño con
backend propio, y es la razón por la que el formulario usa un servicio externo.

## 4. Arquitectura de contenido

### Rutas

- `/` — landing completa.
- `/obras/` — índice del portafolio, filtrable por categoría.
- `/obras/[slug]` — una página por obra, generada estáticamente.

Cada obra tiene página propia por una razón de negocio: una sola página compite
por una sola búsqueda, mientras que veinte páginas de obra compiten por veinte
búsquedas locales distintas ("pasamanos acero inoxidable Quito", "mausoleo en
acero Guayaquil"). Para el objetivo de atraer clientes, esto pesa más que
cualquier efecto visual.

### Colección de obras

Las obras viven en `src/content/obras/*.md`, validadas con un esquema de Astro
Content Collections:

```ts
{
  titulo: string
  categoria: 'acero-inoxidable' | 'hierro' | 'vidrio' | 'construccion'
  ciudad: string
  provincia: string
  anio: number
  cliente?: string
  resumen: string          // 1-2 frases, se muestra en la tarjeta
  materiales: string[]
  reto: string             // qué problema tenía el cliente
  solucion: string         // qué hizo Construaceros
  portada: ImageMetadata
  galeria: ImageMetadata[]
  destacada: boolean       // aparece en la landing
}
```

Agregar una obra es crear un archivo Markdown y hacer push. Si falta un campo
obligatorio, el build falla en lugar de publicar una página incompleta.

### Configuración central

Todos los datos de contacto y ajustes viven en un solo archivo,
`src/config.ts`: teléfono, número de WhatsApp, correo, dirección, horario,
redes sociales, enlaces del menú y llave pública de Web3Forms. Un solo lugar
que tocar cuando cambie un dato.

## 5. Secciones de la landing

1. **Hero 3D.** Pantalla completa, fondo negro. Una pieza de acero inoxidable
   (pasamanos o perfil estructural) renderizada en WebGL con material metálico
   y reflejos de entorno, que rota lentamente en respuesta al scroll. El 3D no
   es decoración: el producto de la empresa *es* el acero, y mostrar cómo
   refleja la luz es el argumento de venta. Titular, bajada y dos llamadas a la
   acción: "Ver obras" y "Escríbenos por WhatsApp".
2. **Trayectoria.** Contadores que se animan al entrar en pantalla: años de
   experiencia, obras entregadas, provincias atendidas.
3. **Servicios.** Cuatro tarjetas: acero inoxidable, estructuras en hierro,
   vidrio templado, construcción civil.
4. **Obras destacadas.** Grid filtrable por categoría con las obras marcadas
   `destacada`. Cada tarjeta enlaza a su página completa.
5. **Cómo trabajamos.** Cinco pasos: visita y medición, diseño y propuesta,
   fabricación, instalación, garantía. Esta sección existe para desactivar el
   miedo de quien nunca ha contratado una obra en acero y no sabe cómo empieza
   el proceso.
6. **Cobertura nacional.** Mapa de Ecuador en SVG donde se iluminan las
   provincias en que la empresa ha trabajado.
7. **Contacto.** Formulario, botón de WhatsApp y teléfono clicable.
8. **Footer.** Datos de la empresa y crédito discreto del desarrollador con
   enlace a su portafolio.

Un botón flotante de WhatsApp acompaña el scroll en todas las páginas.

## 6. Sistema visual

### Color

Tomado del logo: negro, gris acero y amarillo dorado.

| Token | Valor | Uso |
|---|---|---|
| `carbon` | `#0B0B0C` | Fondo principal |
| `grafito` | `#16181B` | Superficies elevadas |
| `acero` | `#C7CBD1` | Texto secundario, bordes, gradientes metálicos |
| `humo` | `#F4F5F7` | Texto principal |
| `ambar` | `#F2B705` | Acento |

El ámbar se usa con avaricia: llamadas a la acción y detalles puntuales. Un
acento que aparece en todas partes deja de ser un acento.

### Tipografía

- Titulares: **Archivo**, condensada e industrial, con tracking cerrado.
  Descarta Bebas Neue por ser el cliché del rubro.
- Texto: **Inter**.
- Ambas servidas localmente vía `@fontsource`, con `font-display: swap`.

### Forma y textura

Esquinas rectas, no redondeadas: el acero no es blando. Fondo con grano sutil y
líneas de plano técnico apenas perceptibles. Fotografía de obras a sangre y en
gran formato, con overlay oscuro para que el ámbar sea el único color saturado
en pantalla.

## 7. Rendimiento y accesibilidad

Estas reglas forman parte del diseño, no son pulido posterior.

- **El 3D se omite en dispositivos limitados.** La isla se hidrata con
  `client:visible` y no se carga bajo 768 px de ancho, ni cuando
  `navigator.hardwareConcurrency <= 4`, ni cuando el usuario pide movimiento
  reducido. En esos casos se muestra una imagen de respaldo del mismo encuadre.
  Un cliente con datos móviles no puede pagar 600 KB de WebGL.
- **`prefers-reduced-motion` se respeta en todas las animaciones**, incluidos
  contadores, reveals y la rotación del hero. Con esta cantidad de movimiento,
  ignorarlo provoca malestar real a una parte de los visitantes.
- **Contraste AA** en todo texto, foco visible en todo elemento interactivo,
  navegación completa por teclado, `alt` descriptivo en cada foto de obra.
- **Imágenes** siempre a través de `astro:assets`. Sin esto, las fotografías
  reales pesarían más que todo el resto del sitio junto.

Objetivo medible: Lighthouse móvil con 90 o más en Rendimiento, Accesibilidad,
Buenas Prácticas y SEO, medido sobre el sitio ya desplegado en Render.

### Animaciones de scroll

Un `IntersectionObserver` de unas diez líneas que agrega una clase CSS al
entrar en viewport cubre los reveals de todas las secciones. No se instala una
librería de animación para el sitio completo: la página ya carga WebGL en el
hero y no necesita más JavaScript global. Motion se usa únicamente dentro de
islas que ya traen React (hero 3D y galería de obras).

## 8. Formulario de contacto

Campos: nombre, teléfono, correo, tipo de obra (select con las cuatro
categorías) y mensaje. Envío por `fetch` al endpoint de Web3Forms; el correo
llega a la bandeja de la empresa.

- Validación nativa del navegador con `required` y `type`, más mensajes de
  error visibles y asociados a cada campo.
- Campo honeypot oculto contra spam.
- Estados explícitos de envío, éxito y error. Si el envío falla, el mensaje de
  error ofrece el WhatsApp como alternativa en lugar de dejar al usuario sin
  salida.

La llave de Web3Forms es pública por diseño y va en `PUBLIC_WEB3FORMS_KEY`.

## 9. SEO

- `<title>` y `<meta description>` propios por página, incluida cada obra.
- JSON-LD `LocalBusiness` en la landing y `Service` en las páginas de obra.
- `@astrojs/sitemap` y `robots.txt`.
- Imagen Open Graph por página, usando la portada de la obra cuando aplique.
- Encabezados en jerarquía correcta, un solo `<h1>` por página.
- URLs en español y sin acentos: `/obras/pasamanos-acero-quito`.

## 10. Despliegue en Render

- Tipo de servicio: **Static Site** (no Web Service).
- Build command: `npm run build`
- Publish directory: `dist`
- Variable de entorno: `PUBLIC_WEB3FORMS_KEY`.
- Redespliegue automático en cada push a la rama principal.
- El repositorio se inicializa con Git y se publica en GitHub, requisito para
  conectar Render.

## 11. Fases

Cada fase deja el sitio en un estado publicable.

**Fase 1 — Base publicada.** Proyecto Astro con Tailwind, layout, sistema de
tokens, header, footer, hero estático con imagen, secciones de servicios y
contacto con datos reales, y **desplegado en Render**. Al terminar esta fase la
empresa ya tiene un sitio que puede enseñar.

**Fase 2 — Portafolio.** Colección de obras, esquema, índice filtrable,
páginas de detalle, galería con lightbox, sección de destacadas en la landing.
Carga del material real (fotos y datos de proyectos).

**Fase 3 — Movimiento.** Escena 3D del hero con su fallback y sus condiciones
de omisión, reveals de scroll, contadores, mapa de cobertura.

**Fase 4 — Cierre.** Formulario conectado a Web3Forms, JSON-LD, sitemap,
imágenes Open Graph, auditoría de accesibilidad y Lighthouse, README con las
decisiones técnicas.

## 12. Datos pendientes del cliente

Estos datos no existen todavía y bloquean partes concretas. Hasta obtenerlos se
usan valores marcados en `src/config.ts`, nunca datos inventados publicados
como reales.

| Dato | Bloquea |
|---|---|
| Teléfono y número de WhatsApp | Fase 1 |
| Correo de destino del formulario | Fase 4 |
| Dirección física y horario | Fase 1 (footer) |
| Redes sociales, si existen | Fase 1 (footer) |
| Fotos y fichas de obras | Fase 2 |
| Cifras reales de trayectoria | Fase 3 (contadores) |
| Provincias atendidas | Fase 3 (mapa) |
| Llave de Web3Forms | Fase 4 |

## 13. Criterios de éxito

1. El sitio está publicado en Render con HTTPS y redespliegue automático.
2. Lighthouse móvil: 90 o más en las cuatro categorías.
3. Cada obra tiene su propia URL indexable con datos estructurados.
4. Un visitante puede contactar por tres vías: formulario, WhatsApp y teléfono.
5. El sitio es usable y legible con JavaScript degradado, en un celular de gama
   media y con conexión lenta.
6. Agregar una obra nueva requiere un archivo Markdown y un push, sin tocar
   código de componentes.
