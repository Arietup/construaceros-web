# Construaceros Web — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir y publicar en Render el sitio de Construaceros: landing en español con portafolio de obras indexable, hero 3D y tres vías de contacto.

**Architecture:** Sitio estático Astro sin backend. El HTML se genera en build; React solo se hidrata en dos islas (hero 3D y galería). Las obras viven como Markdown en una content collection validada por esquema, y cada una genera su propia página. El formulario envía a Web3Forms desde el navegador, lo que mantiene el sitio 100 % estático y elimina el cold start del plan gratuito de Render.

**Tech Stack:** Astro 7, Tailwind CSS 4, TypeScript, React Three Fiber + drei, Vitest, Web3Forms, Render Static Site.

**Spec:** `docs/superpowers/specs/2026-08-27-construaceros-web-design.md`

## Global Constraints

- Idioma único: **español**. Todo el texto visible, los nombres de archivo de contenido y las URLs en español, sin acentos en las URLs.
- Node 22. Fijado en `.node-version` para que Render use la misma versión.
- Paleta exacta: `carbon #0B0B0C`, `grafito #16181B`, `acero #C7CBD1`, `humo #F4F5F7`, `ambar #F2B705`. El ámbar solo en llamadas a la acción y detalles puntuales.
- Tipografía: **Archivo** en titulares, **Inter** en texto, servidas localmente vía `@fontsource-variable`.
- Esquinas rectas. Ningún `rounded-*` mayor a `rounded-sm` en superficies estructurales.
- `prefers-reduced-motion: reduce` desactiva **toda** animación, incluida la rotación del hero 3D.
- Toda imagen de contenido pasa por `astro:assets`. Ninguna etiqueta `<img>` cruda para fotos de obras.
- Ningún dato de contacto se escribe inline en un componente: todo sale de `src/config.ts`.
- Los valores de contacto aún no entregados por el cliente se marcan con el prefijo `PENDIENTE:` en `src/config.ts` y nunca se publican como si fueran reales.
- Solo se escriben tests para funciones puras de lógica no trivial. La verificación del resto es `npm run build` verde más revisión visual. No se testean componentes de presentación.

---

## Estructura de archivos

| Archivo | Responsabilidad |
|---|---|
| `src/config.ts` | Único lugar con datos de la empresa y llaves |
| `src/lib/contacto.ts` | Construcción de enlaces de WhatsApp y teléfono |
| `src/lib/formulario.ts` | Envío a Web3Forms y honeypot |
| `src/lib/render3d.ts` | Decisión de cargar o no la escena WebGL |
| `src/lib/obras.ts` | Filtrado y ordenamiento de obras |
| `src/content.config.ts` | Esquema de la colección `obras` |
| `src/layouts/Layout.astro` | Estructura HTML, fuentes, header, footer, WhatsApp flotante |
| `src/components/Seo.astro` | `<title>`, meta, Open Graph, JSON-LD |
| `src/components/*.astro` | Una sección de landing por archivo |
| `src/components/Hero3D.tsx` | Isla React con la escena WebGL |
| `src/components/Galeria.tsx` | Isla React con el lightbox |
| `src/pages/index.astro` | Landing |
| `src/pages/obras/index.astro` | Índice del portafolio |
| `src/pages/obras/[...slug].astro` | Página por obra |
| `src/styles/global.css` | Tokens Tailwind 4, grano de fondo, utilidades de reveal |

---

# FASE 1 — Base publicada

### Task 1: Andamiaje del proyecto

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `.node-version`, `src/pages/index.astro`, `src/styles/global.css`

**Interfaces:**
- Consumes: nada.
- Produces: proyecto Astro que compila con `npm run build`, con Tailwind 4, React y Vitest instalados.

- [x] **Step 1: Crear el proyecto Astro**

Desde `C:\sistemas\caconstruaceroweb`, con `logo.jpg` y `docs/` ya presentes, se crea el proyecto en el directorio actual:

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git --skip-houston
```

Si pregunta por el directorio no vacío, confirmar que continúe. `logo.jpg` y `docs/` no se tocan.

- [x] **Step 2: Instalar dependencias e integraciones**

```bash
npm install
npx astro add tailwind react sitemap --yes
npm install @fontsource-variable/archivo @fontsource-variable/inter
npm install three @react-three/fiber @react-three/drei
npm install -D vitest @types/three
```

- [x] **Step 3: Fijar la versión de Node**

Crear `.node-version`:

```
22
```

Y en `package.json` añadir el script de test dentro de `"scripts"`:

```json
"test": "vitest run"
```

- [x] **Step 4: Configurar Astro**

Reemplazar `astro.config.mjs`:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://construaceros-web.onrender.com',
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

`site` es obligatorio para que el sitemap genere URLs absolutas. Cuando la empresa compre dominio propio, este es el único valor que cambia.

- [x] **Step 5: Verificar que compila**

```bash
npm run build
```

Esperado: termina sin errores y crea `dist/index.html`.

- [x] **Step 6: Inicializar Git y commit**

```bash
git init
git branch -M main
git add -A
git commit -m "chore: andamiaje Astro 5 con Tailwind 4, React y Vitest"
```

---

### Task 2: Tokens de diseño y estilos base

**Files:**
- Create: `src/styles/global.css`
- Test: ninguno (CSS de presentación)

**Interfaces:**
- Consumes: Tailwind 4 desde Task 1.
- Produces: clases `bg-carbon`, `text-humo`, `text-acero`, `bg-ambar`, `bg-grafito`, `font-display`, `font-cuerpo`, y las utilidades `.reveal` / `.reveal-visible` que consumen las Tasks 5, 9 y 12.

- [x] **Step 1: Escribir los tokens**

Reemplazar `src/styles/global.css`:

```css
@import 'tailwindcss';

@import '@fontsource-variable/archivo';
@import '@fontsource-variable/inter';

@theme {
  --color-carbon: #0b0b0c;
  --color-grafito: #16181b;
  --color-acero: #c7cbd1;
  --color-humo: #f4f5f7;
  --color-ambar: #f2b705;

  --font-display: 'Archivo Variable', system-ui, sans-serif;
  --font-cuerpo: 'Inter Variable', system-ui, sans-serif;
}

@layer base {
  html {
    scroll-behavior: smooth;
    /* Compensa el header fijo (~96px) para que los anclajes no queden tapados. */
    scroll-padding-top: 6.5rem;
    background-color: var(--color-carbon);
    color: var(--color-humo);
    font-family: var(--font-cuerpo);
  }

  h1, h2, h3 {
    font-family: var(--font-display);
    letter-spacing: -0.02em;
    text-transform: uppercase;
  }

  /* Foco visible en todo elemento interactivo. No se elimina nunca. */
  :focus-visible {
    outline: 2px solid var(--color-ambar);
    outline-offset: 3px;
  }
}

@layer utilities {
  /* Reveal al entrar en viewport. `.reveal-visible` la agrega el observer de la Task 12.
     El ocultamiento se aplica SOLO bajo `.js`, que el layout marca en el <head> si hay
     JavaScript: sin JS nada se oculta nunca y el contenido siempre es legible. */
  .js .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 700ms ease-out, transform 700ms ease-out;
  }

  .js .reveal-visible {
    opacity: 1;
    transform: none;
  }

  /* Grano sutil sobre fondos oscuros. */
  .grano::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E");
  }
}

/* Regla global: quien pide menos movimiento no recibe ninguno. */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .js .reveal {
    opacity: 1;
    transform: none;
  }
}
```

- [x] **Step 2: Verificar**

```bash
npm run build
```

Esperado: build verde. El CSS todavía no se usa en ninguna página; se conecta en la Task 4.

- [x] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: tokens de diseño, tipografía y utilidades de movimiento"
```

---

### Task 3: Configuración central y helpers de contacto

**Files:**
- Create: `src/config.ts`, `src/lib/contacto.ts`
- Test: `src/lib/contacto.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `EMPRESA` — objeto con `nombre`, `bajada`, `descripcion`, `telefono`, `whatsapp`, `correo`, `direccion`, `horario`, `ciudad`, `pais`, `redes`, `web3formsKey`.
  - `whatsappUrl(numero: string, mensaje: string): string`
  - `telefonoUrl(numero: string): string`
  - `MENSAJE_WHATSAPP`, `NAV`, `CATEGORIAS`, `type Categoria`
  - Los consumen las Tasks 4, 5, 6, 7, 9, 10, 14 y 15.

- [x] **Step 1: Escribir el test**

Crear `src/lib/contacto.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { telefonoUrl, whatsappUrl } from './contacto';

describe('whatsappUrl', () => {
  it('quita todo lo que no sea dígito del número', () => {
    expect(whatsappUrl('+593 99 123 4567', 'Hola')).toContain('https://wa.me/593991234567');
  });

  it('codifica el mensaje para que tildes y espacios no rompan el enlace', () => {
    expect(whatsappUrl('593991234567', 'Quiero una cotización')).toBe(
      'https://wa.me/593991234567?text=Quiero%20una%20cotizaci%C3%B3n',
    );
  });
});

describe('telefonoUrl', () => {
  it('genera un enlace tel: sin espacios', () => {
    expect(telefonoUrl('+593 2 234 5678')).toBe('tel:+59322345678');
  });
});
```

- [x] **Step 2: Correr el test y ver que falla**

```bash
npm test
```

Esperado: FALLA con "Failed to resolve import './contacto'".

- [x] **Step 3: Implementar los helpers**

Crear `src/lib/contacto.ts`:

```ts
/** wa.me exige el número sin signos ni espacios, y el mensaje URL-encoded. */
export function whatsappUrl(numero: string, mensaje: string): string {
  const digitos = numero.replace(/\D/g, '');
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje)}`;
}

export function telefonoUrl(numero: string): string {
  return `tel:${numero.replace(/[^\d+]/g, '')}`;
}
```

- [x] **Step 4: Correr el test y ver que pasa**

```bash
npm test
```

Esperado: 3 tests PASAN.

- [x] **Step 5: Escribir la configuración central**

Crear `src/config.ts`. Los valores con prefijo `PENDIENTE:` son los que el cliente aún no entrega; se reemplazan sin tocar ningún componente:

```ts
export const EMPRESA = {
  nombre: 'ConstruAceros',
  bajada: 'Construcciones en Acero Inoxidable',
  descripcion:
    'Más de 20 años fabricando estructuras en acero inoxidable, hierro y vidrio en todo el Ecuador. Obra industrial, residencial y construcción civil.',
  telefono: 'PENDIENTE:+593000000000',
  whatsapp: 'PENDIENTE:+593000000000',
  correo: 'PENDIENTE:correo@construaceros.ec',
  direccion: 'PENDIENTE:dirección',
  horario: 'PENDIENTE:Lunes a viernes, 08:00 a 17:00',
  ciudad: 'Quito',
  pais: 'EC',
  redes: {
    facebook: '',
    instagram: '',
  },
  /** Pública por diseño. Web3Forms la valida contra el correo de destino. */
  web3formsKey: import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '',
} as const;

export const MENSAJE_WHATSAPP =
  'Hola, vi su página web y quisiera información sobre un trabajo en acero.';

export const NAV = [
  { href: '/#servicios', texto: 'Servicios' },
  { href: '/obras/', texto: 'Obras' },
  { href: '/#proceso', texto: 'Cómo trabajamos' },
  { href: '/#contacto', texto: 'Contacto' },
] as const;

export const CATEGORIAS = {
  'acero-inoxidable': 'Acero inoxidable',
  hierro: 'Estructuras en hierro',
  vidrio: 'Vidrio templado',
  construccion: 'Construcción civil',
} as const;

export type Categoria = keyof typeof CATEGORIAS;
```

- [x] **Step 6: Verificar y commit**

```bash
npm test && npm run build
git add src/config.ts src/lib/contacto.ts src/lib/contacto.test.ts
git commit -m "feat: configuración central de la empresa y helpers de contacto"
```

---

### Task 4: Layout, header, footer y WhatsApp flotante

**Files:**
- Create: `src/layouts/Layout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/BotonWhatsApp.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `EMPRESA`, `NAV`, `MENSAJE_WHATSAPP` de `src/config.ts`; `whatsappUrl`, `telefonoUrl` de `src/lib/contacto.ts`.
- Produces: `Layout.astro` con props `{ titulo: string; descripcion?: string }` y un `<slot />`. Lo usan todas las páginas de las Tasks 5, 7, 9 y 10. La Task 15 le añade las props `imagen` y `jsonLd`. También marca la clase `.js` en `<html>`, de la que depende el CSS de reveals de la Task 2.

- [x] **Step 0: Mover el logotipo dentro de `src/`**

```bash
mkdir -p src/assets
git mv logo.jpg src/assets/logo.jpg
```

`astro:assets` está pensado para imágenes bajo `src/`, y es donde el resto del plan guarda las suyas.

- [x] **Step 1: Crear el layout**

Crear `src/layouts/Layout.astro`:

```astro
---
import '../styles/global.css';
import { EMPRESA } from '../config';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import BotonWhatsApp from '../components/BotonWhatsApp.astro';

interface Props {
  titulo: string;
  descripcion?: string;
}

const { titulo, descripcion = EMPRESA.descripcion } = Astro.props;
---

<!doctype html>
<html lang="es-EC">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <title>{titulo}</title>
    <meta name="description" content={descripcion} />
    <!-- Marca que hay JavaScript ANTES del primer pintado. El CSS oculta los
         .reveal solo bajo .js, así que sin JavaScript el contenido siempre se ve. -->
    <script is:inline>document.documentElement.classList.add('js');</script>
  </head>
  <body class="bg-carbon text-humo font-cuerpo antialiased">
    <a
      href="#contenido"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-ambar focus:px-4 focus:py-2 focus:text-carbon"
    >
      Saltar al contenido
    </a>
    <Header />
    <main id="contenido"><slot /></main>
    <Footer />
    <BotonWhatsApp />
  </body>
</html>
```

El enlace "Saltar al contenido" no es opcional: sin él, quien navega por teclado atraviesa el menú entero en cada página.

- [x] **Step 2: Crear el header**

Crear `src/components/Header.astro`:

```astro
---
import { Image } from 'astro:assets';
import { EMPRESA, MENSAJE_WHATSAPP, NAV } from '../config';
import { whatsappUrl } from '../lib/contacto';
import logo from '../assets/logo.jpg';
---

<header class="fixed top-0 z-40 w-full border-b border-white/10 bg-carbon/85 backdrop-blur">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
    <a href="/" class="flex items-center gap-3" aria-label={`${EMPRESA.nombre}, inicio`}>
      <Image src={logo} alt={`Logotipo de ${EMPRESA.nombre}`} width={160} height={72} loading="eager" />
    </a>

    <nav class="hidden items-center gap-8 md:flex" aria-label="Principal">
      {NAV.map((item) => (
        <a href={item.href} class="text-sm text-acero transition-colors hover:text-humo">
          {item.texto}
        </a>
      ))}
    </nav>

    <a
      href={whatsappUrl(EMPRESA.whatsapp, MENSAJE_WHATSAPP)}
      target="_blank"
      rel="noopener"
      class="bg-ambar px-4 py-2 text-sm font-semibold text-carbon transition-opacity hover:opacity-90"
    >
      Cotizar
    </a>
  </div>
</header>
```

- [x] **Step 3: Crear el footer**

Crear `src/components/Footer.astro`:

```astro
---
import { EMPRESA } from '../config';
import { telefonoUrl } from '../lib/contacto';
const anio = new Date().getFullYear();
---

<footer class="border-t border-white/10 bg-grafito">
  <div class="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
    <div>
      <p class="font-display text-2xl">{EMPRESA.nombre}</p>
      <p class="mt-2 text-sm text-acero">{EMPRESA.bajada}</p>
    </div>

    <div class="text-sm text-acero">
      <p class="mb-3 font-semibold text-humo">Contacto</p>
      <p><a class="hover:text-humo" href={telefonoUrl(EMPRESA.telefono)}>{EMPRESA.telefono}</a></p>
      <p><a class="hover:text-humo" href={`mailto:${EMPRESA.correo}`}>{EMPRESA.correo}</a></p>
      <p class="mt-2">{EMPRESA.direccion}</p>
      <p>{EMPRESA.horario}</p>
    </div>

    <div class="text-sm text-acero">
      <p class="mb-3 font-semibold text-humo">Cobertura</p>
      <p>Todo el Ecuador</p>
    </div>
  </div>

  <div class="border-t border-white/10 px-6 py-5 text-center text-xs text-acero">
    <p>© {anio} {EMPRESA.nombre}. Todos los derechos reservados.</p>
    <p class="mt-1">
      Desarrollado por
      <a class="text-ambar hover:underline" href="https://github.com/Arietup" target="_blank" rel="noopener">
        Dario Estupiñán
      </a>
    </p>
  </div>
</footer>
```

- [x] **Step 4: Crear el botón flotante**

Crear `src/components/BotonWhatsApp.astro`:

```astro
---
import { EMPRESA, MENSAJE_WHATSAPP } from '../config';
import { whatsappUrl } from '../lib/contacto';
---

<a
  href={whatsappUrl(EMPRESA.whatsapp, MENSAJE_WHATSAPP)}
  target="_blank"
  rel="noopener"
  aria-label="Escribir por WhatsApp"
  class="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105"
>
  <svg viewBox="0 0 24 24" width="28" height="28" fill="#0B0B0C" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.3-1.94 1.34-.5.04-.98.22-3.3-.69-2.77-1.09-4.53-3.92-4.67-4.1-.13-.18-1.11-1.48-1.11-2.82 0-1.34.7-2 .95-2.27a1 1 0 0 1 .72-.34c.18 0 .36 0 .52.01.17.01.4-.06.62.48.24.57.8 1.97.87 2.11.07.14.12.31.02.5-.1.18-.15.3-.29.46-.14.16-.3.36-.43.48-.14.14-.29.29-.13.57.17.28.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.29 1.41.28.14.45.12.61-.07.17-.19.71-.83.9-1.11.19-.28.37-.23.63-.14.25.09 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.69-.17 1.37Z"/>
  </svg>
</a>
```

Excepción deliberada a la regla de esquinas rectas: el botón flotante de WhatsApp se reconoce por su forma circular, y romperla lo vuelve menos identificable.

- [x] **Step 5: Conectar la página de inicio**

Reemplazar `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import { EMPRESA } from '../config';
---

<Layout titulo={`${EMPRESA.nombre} — ${EMPRESA.bajada}`}>
  <div class="pt-32 pb-24 text-center">
    <h1 class="text-5xl">{EMPRESA.nombre}</h1>
  </div>
</Layout>
```

- [x] **Step 6: Verificar en el navegador**

```bash
npm run dev
```

Comprobar en `http://localhost:4321`: logo visible, menú en escritorio, botón de WhatsApp abajo a la derecha, y que al pulsar Tab aparece "Saltar al contenido" antes que cualquier otro enlace.

- [x] **Step 7: Commit**

```bash
npm run build
git add -A
git commit -m "feat: layout base con header, footer y WhatsApp flotante"
```

---

### Task 5: Secciones Hero, Servicios y Proceso

**Files:**
- Create: `src/components/Hero.astro`, `src/components/Servicios.astro`, `src/components/Proceso.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `Layout.astro`, `EMPRESA`, `MENSAJE_WHATSAPP`, `whatsappUrl`.
- Produces: `Hero.astro` con un `<div id="hero-3d">` vacío que la Task 13 rellena con la isla WebGL. Las secciones exponen los anclajes `#servicios` y `#proceso` que usa `NAV`.

- [x] **Step 1: Crear el hero estático**

Crear `src/components/Hero.astro`. Por ahora el contenedor 3D queda vacío; la Task 13 monta la escena sin tocar esta estructura:

```astro
---
import { EMPRESA, MENSAJE_WHATSAPP } from '../config';
import { whatsappUrl } from '../lib/contacto';
---

<section class="grano relative flex min-h-[92vh] items-center overflow-hidden bg-carbon">
  <!-- La Task 13 monta aquí la escena WebGL y su imagen de respaldo. -->
  <div id="hero-3d" class="absolute inset-0" aria-hidden="true"></div>

  <div class="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/80 to-transparent"></div>

  <div class="relative mx-auto w-full max-w-7xl px-6 pt-24">
    <p class="mb-5 text-sm tracking-[0.3em] text-ambar uppercase">Más de 20 años en el Ecuador</p>

    <h1 class="max-w-4xl text-5xl leading-[0.95] md:text-7xl">
      Acero que sostiene<br />lo que usted construye
    </h1>

    <p class="mt-6 max-w-xl text-lg text-acero">
      Acero inoxidable, estructuras en hierro, vidrio templado y construcción civil.
      Diseño, fabricación e instalación en todo el país.
    </p>

    <div class="mt-10 flex flex-wrap gap-4">
      <a href="/obras/" class="bg-ambar px-7 py-3 font-semibold text-carbon transition-opacity hover:opacity-90">
        Ver nuestras obras
      </a>
      <a
        href={whatsappUrl(EMPRESA.whatsapp, MENSAJE_WHATSAPP)}
        target="_blank"
        rel="noopener"
        class="border border-acero/40 px-7 py-3 font-semibold text-humo transition-colors hover:border-ambar hover:text-ambar"
      >
        Escríbenos por WhatsApp
      </a>
    </div>
  </div>
</section>
```

- [x] **Step 2: Crear la sección de servicios**

Crear `src/components/Servicios.astro`:

```astro
---
const servicios = [
  {
    titulo: 'Acero inoxidable',
    texto:
      'Pasamanos, barandas, puertas, mesones y mobiliario industrial. Acabado pulido o satinado, resistente a la intemperie de la costa y la sierra.',
  },
  {
    titulo: 'Estructuras en hierro',
    texto:
      'Galpones, cubiertas, escaleras, portones y estructura metálica para obra industrial y residencial.',
  },
  {
    titulo: 'Vidrio templado',
    texto:
      'Fachadas, divisiones, barandas de vidrio con anclaje en acero y puertas templadas con herrajes de alta resistencia.',
  },
  {
    titulo: 'Construcción civil',
    texto:
      'Mausoleos, casas, edificios y departamentos. Obra completa, desde el diseño hasta la entrega.',
  },
];
---

<section id="servicios" class="mx-auto max-w-7xl px-6 py-24">
  <h2 class="text-4xl md:text-5xl">Lo que hacemos</h2>
  <p class="mt-4 max-w-2xl text-acero">
    Cuatro líneas de trabajo, un solo equipo. Nos encargamos del diseño, la fabricación y la
    instalación, sin subcontratar la parte crítica.
  </p>

  <div class="mt-14 grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-4">
    {servicios.map((s) => (
      <article class="reveal bg-carbon p-8 transition-colors hover:bg-grafito">
        <h3 class="text-xl text-humo">{s.titulo}</h3>
        <p class="mt-3 text-sm leading-relaxed text-acero">{s.texto}</p>
      </article>
    ))}
  </div>
</section>
```

- [x] **Step 3: Crear la sección de proceso**

Crear `src/components/Proceso.astro`:

```astro
---
const pasos = [
  { n: '01', titulo: 'Visita y medición', texto: 'Vamos al sitio, medimos y entendemos qué necesita. Sin costo.' },
  { n: '02', titulo: 'Diseño y propuesta', texto: 'Le presentamos el diseño y una propuesta con materiales y plazos por escrito.' },
  { n: '03', titulo: 'Fabricación', texto: 'Fabricamos en taller propio, con control de cada pieza antes de salir.' },
  { n: '04', titulo: 'Instalación', texto: 'Instalamos con nuestro equipo y dejamos el sitio limpio.' },
  { n: '05', titulo: 'Garantía', texto: 'Respondemos por el trabajo entregado. Si algo falla, volvemos.' },
];
---

<section id="proceso" class="border-y border-white/10 bg-grafito">
  <div class="mx-auto max-w-7xl px-6 py-24">
    <h2 class="text-4xl md:text-5xl">Cómo trabajamos</h2>
    <p class="mt-4 max-w-2xl text-acero">
      Si nunca ha contratado una obra en acero, así se ve el proceso completo de principio a fin.
    </p>

    <ol class="mt-14 grid gap-8 md:grid-cols-3 lg:grid-cols-5">
      {pasos.map((p) => (
        <li class="reveal border-t-2 border-ambar pt-5">
          <span class="font-display text-3xl text-ambar">{p.n}</span>
          <h3 class="mt-2 text-lg text-humo">{p.titulo}</h3>
          <p class="mt-2 text-sm leading-relaxed text-acero">{p.texto}</p>
        </li>
      ))}
    </ol>
  </div>
</section>
```

- [x] **Step 4: Montar las secciones en la landing**

Reemplazar `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import Servicios from '../components/Servicios.astro';
import Proceso from '../components/Proceso.astro';
import { EMPRESA } from '../config';
---

<Layout titulo={`${EMPRESA.nombre} — ${EMPRESA.bajada}`}>
  <Hero />
  <Servicios />
  <Proceso />
</Layout>
```

- [x] **Step 5: Verificar**

```bash
npm run build
```

Esperado: build verde. Revisar en `npm run dev` que los anclajes `#servicios` y `#proceso` del menú saltan a la sección correcta.

- [x] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: secciones hero, servicios y proceso"
```

---

### Task 6: Sección de contacto con formulario

**Files:**
- Create: `src/lib/formulario.ts`, `src/components/Contacto.astro`
- Test: `src/lib/formulario.test.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `EMPRESA`, `CATEGORIAS`, `MENSAJE_WHATSAPP`, `whatsappUrl`, `telefonoUrl`.
- Produces: `enviarFormulario(datos: Record<string, string>, accessKey: string, f?: typeof fetch): Promise<ResultadoEnvio>` donde `ResultadoEnvio = { ok: true } | { ok: false; error: string }`.

- [ ] **Step 1: Escribir el test**

Crear `src/lib/formulario.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { enviarFormulario } from './formulario';

const respuesta = (body: unknown) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status: 200 }));

describe('enviarFormulario', () => {
  it('envía los datos junto con la access key', async () => {
    const fake = respuesta({ success: true });
    const r = await enviarFormulario({ nombre: 'Ana' }, 'llave-123', fake as unknown as typeof fetch);

    expect(r).toEqual({ ok: true });
    const init = fake.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(init.body as string)).toEqual({ access_key: 'llave-123', nombre: 'Ana' });
  });

  it('no envía nada si el honeypot viene lleno, pero finge éxito ante el bot', async () => {
    const fake = respuesta({ success: true });
    const r = await enviarFormulario(
      { nombre: 'Bot', sitioWeb: 'spam.com' },
      'llave-123',
      fake as unknown as typeof fetch,
    );

    expect(r).toEqual({ ok: true });
    expect(fake).not.toHaveBeenCalled();
  });

  it('devuelve el mensaje del servicio cuando el envío es rechazado', async () => {
    const fake = respuesta({ success: false, message: 'Llave inválida' });
    const r = await enviarFormulario({ nombre: 'Ana' }, 'mala', fake as unknown as typeof fetch);

    expect(r).toEqual({ ok: false, error: 'Llave inválida' });
  });

  it('no lanza excepción si el usuario se queda sin conexión', async () => {
    const fake = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    });
    const r = await enviarFormulario({ nombre: 'Ana' }, 'llave', fake as unknown as typeof fetch);

    expect(r.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Correr el test y ver que falla**

```bash
npm test
```

Esperado: FALLA con "Failed to resolve import './formulario'".

- [ ] **Step 3: Implementar el envío**

Crear `src/lib/formulario.ts`:

```ts
export type ResultadoEnvio = { ok: true } | { ok: false; error: string };

const ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * Envía el formulario a Web3Forms. El parámetro `f` existe para poder testear
 * sin red; en producción se usa el fetch del navegador.
 */
export async function enviarFormulario(
  datos: Record<string, string>,
  accessKey: string,
  f: typeof fetch = fetch,
): Promise<ResultadoEnvio> {
  // Honeypot: un humano nunca llena este campo. Fingimos éxito para que el bot
  // no aprenda que fue detectado, pero no gastamos una petición.
  const { sitioWeb, ...limpios } = datos;
  if (sitioWeb) return { ok: true };

  try {
    const res = await f(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: accessKey, ...limpios }),
    });
    const json = (await res.json()) as { success?: boolean; message?: string };
    return json.success
      ? { ok: true }
      : { ok: false, error: json.message ?? 'No se pudo enviar el mensaje.' };
  } catch {
    return { ok: false, error: 'No hay conexión. Intente de nuevo o escríbanos por WhatsApp.' };
  }
}
```

- [ ] **Step 4: Correr el test y ver que pasa**

```bash
npm test
```

Esperado: los 4 tests PASAN.

- [ ] **Step 5: Crear la sección de contacto**

Crear `src/components/Contacto.astro`:

```astro
---
import { CATEGORIAS, EMPRESA, MENSAJE_WHATSAPP } from '../config';
import { telefonoUrl, whatsappUrl } from '../lib/contacto';
---

<section id="contacto" class="mx-auto max-w-7xl px-6 py-24">
  <div class="grid gap-16 lg:grid-cols-2">
    <div>
      <h2 class="text-4xl md:text-5xl">Conversemos su proyecto</h2>
      <p class="mt-4 text-acero">
        Cuéntenos qué necesita. Respondemos con una propuesta clara, sin compromiso.
      </p>

      <div class="mt-10 space-y-4">
        <a
          href={whatsappUrl(EMPRESA.whatsapp, MENSAJE_WHATSAPP)}
          target="_blank"
          rel="noopener"
          class="block border border-white/15 p-5 transition-colors hover:border-ambar"
        >
          <span class="block text-xs tracking-widest text-acero uppercase">WhatsApp</span>
          <span class="mt-1 block text-lg text-humo">{EMPRESA.whatsapp}</span>
        </a>

        <a
          href={telefonoUrl(EMPRESA.telefono)}
          class="block border border-white/15 p-5 transition-colors hover:border-ambar"
        >
          <span class="block text-xs tracking-widest text-acero uppercase">Teléfono</span>
          <span class="mt-1 block text-lg text-humo">{EMPRESA.telefono}</span>
        </a>
      </div>
    </div>

    <form id="form-contacto" class="space-y-5">
      <div>
        <label for="nombre" class="mb-2 block text-sm text-acero">Nombre completo</label>
        <input
          id="nombre" name="nombre" type="text" required autocomplete="name"
          class="w-full border border-white/15 bg-grafito px-4 py-3 text-humo focus:border-ambar focus:outline-none"
        />
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="telefono" class="mb-2 block text-sm text-acero">Teléfono</label>
          <input
            id="telefono" name="telefono" type="tel" required autocomplete="tel"
            class="w-full border border-white/15 bg-grafito px-4 py-3 text-humo focus:border-ambar focus:outline-none"
          />
        </div>
        <div>
          <label for="correo" class="mb-2 block text-sm text-acero">Correo</label>
          <input
            id="correo" name="correo" type="email" required autocomplete="email"
            class="w-full border border-white/15 bg-grafito px-4 py-3 text-humo focus:border-ambar focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label for="tipo" class="mb-2 block text-sm text-acero">Tipo de trabajo</label>
        <select
          id="tipo" name="tipo" required
          class="w-full border border-white/15 bg-grafito px-4 py-3 text-humo focus:border-ambar focus:outline-none"
        >
          {Object.entries(CATEGORIAS).map(([valor, texto]) => (
            <option value={valor}>{texto}</option>
          ))}
          <option value="otro">Otro</option>
        </select>
      </div>

      <div>
        <label for="mensaje" class="mb-2 block text-sm text-acero">Cuéntenos qué necesita</label>
        <textarea
          id="mensaje" name="mensaje" rows="5" required
          class="w-full border border-white/15 bg-grafito px-4 py-3 text-humo focus:border-ambar focus:outline-none"
        ></textarea>
      </div>

      <!-- Honeypot: invisible para personas, irresistible para bots. -->
      <input type="text" name="sitioWeb" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />

      <button
        type="submit"
        class="w-full bg-ambar px-7 py-4 font-semibold text-carbon transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        Enviar mensaje
      </button>

      <p id="form-estado" role="status" aria-live="polite" class="min-h-6 text-sm"></p>
    </form>
  </div>
</section>

<script>
  import { enviarFormulario } from '../lib/formulario';
  import { EMPRESA } from '../config';

  const form = document.getElementById('form-contacto') as HTMLFormElement | null;
  const estado = document.getElementById('form-estado');
  const boton = form?.querySelector('button[type="submit"]') as HTMLButtonElement | null;

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity() || !estado || !boton) return;

    boton.disabled = true;
    estado.textContent = 'Enviando…';
    estado.className = 'min-h-6 text-sm text-acero';

    const datos = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const r = await enviarFormulario(datos, EMPRESA.web3formsKey);

    if (r.ok) {
      form.reset();
      estado.textContent = 'Mensaje enviado. Le respondemos a la brevedad.';
      estado.className = 'min-h-6 text-sm text-ambar';
    } else {
      estado.textContent = r.error;
      estado.className = 'min-h-6 text-sm text-red-400';
    }
    boton.disabled = false;
  });
</script>
```

- [ ] **Step 6: Montar en la landing**

En `src/pages/index.astro`, añadir el import y el componente después de `<Proceso />`:

```astro
import Contacto from '../components/Contacto.astro';
```

```astro
  <Proceso />
  <Contacto />
```

- [ ] **Step 7: Verificar y commit**

```bash
npm test && npm run build
git add -A
git commit -m "feat: sección de contacto con formulario y honeypot"
```

Sin `PUBLIC_WEB3FORMS_KEY` configurada el envío devolverá error, y eso es correcto: la conexión real se hace en la Task 15.

---

### Task 7: Publicar en Render

**Files:**
- Create: `render.yaml`, `README.md`, `public/favicon.svg`, `src/pages/404.astro`

**Interfaces:**
- Consumes: proyecto compilable de las Tasks 1-6.
- Produces: sitio en vivo con redespliegue automático en cada push.

- [ ] **Step 1: Crear la página 404**

Crear `src/pages/404.astro`. Render sirve este archivo automáticamente:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout titulo="Página no encontrada — ConstruAceros">
  <section class="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-6 text-center">
    <p class="font-display text-7xl text-ambar">404</p>
    <h1 class="mt-4 text-3xl">Esta página no existe</h1>
    <p class="mt-4 text-acero">Puede volver al inicio o revisar nuestras obras.</p>
    <div class="mt-8 flex justify-center gap-4">
      <a href="/" class="bg-ambar px-6 py-3 font-semibold text-carbon">Ir al inicio</a>
      <a href="/obras/" class="border border-acero/40 px-6 py-3 font-semibold">Ver obras</a>
    </div>
  </section>
</Layout>
```

El enlace a `/obras/` apunta a una ruta que existe desde la Task 9. Hasta entonces devuelve el propio 404, lo cual es inofensivo.

- [ ] **Step 2: Crear el favicon**

Crear `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#0B0B0C"/>
  <text x="16" y="23" font-family="Arial Black, sans-serif" font-size="20" font-weight="900"
        fill="#F2B705" text-anchor="middle">C</text>
</svg>
```

- [ ] **Step 3: Crear el blueprint de Render**

Crear `render.yaml`:

```yaml
services:
  - type: web
    name: construaceros-web
    runtime: static
    buildCommand: npm ci && npm run build
    staticPublishPath: ./dist
    pullRequestPreviewsEnabled: true
    headers:
      - path: /*
        name: X-Content-Type-Options
        value: nosniff
      - path: /*
        name: Referrer-Policy
        value: strict-origin-when-cross-origin
```

Sin `routes` de reescritura: Astro genera un archivo HTML real por página y una reescritura comodín rompería el 404.

- [ ] **Step 4: Escribir el README**

Crear `README.md`:

````markdown
# ConstruAceros Web

Sitio de ConstruAceros — construcciones en acero inoxidable, hierro y vidrio en Ecuador.

## Stack

Astro 7 · Tailwind CSS 4 · TypeScript · React Three Fiber · Vitest · Render Static Site

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm test         # tests de lógica
npm run build    # genera dist/
```

## Agregar una obra al portafolio

1. Copiar las fotos a `src/assets/obras/<slug>/`.
2. Crear `src/content/obras/<slug>.md` con el frontmatter completo.
3. `npm run build` — si falta un campo obligatorio, el build falla antes de publicar.
4. `git push` — Render redespliega solo.

## Variables de entorno

| Variable | Uso |
|---|---|
| `PUBLIC_WEB3FORMS_KEY` | Llave del formulario de contacto |

## Decisiones técnicas

Documentadas en `docs/superpowers/specs/2026-08-27-construaceros-web-design.md`.
````

- [ ] **Step 5: Publicar en GitHub**

El repositorio `construaceros-web` debe existir y estar vacío.

```bash
git add -A
git commit -m "chore: blueprint de Render, 404, favicon y README"
git remote add origin https://github.com/Arietup/construaceros-web.git
git push -u origin main
```

- [ ] **Step 6: Conectar Render**

En el panel de Render: **New → Static Site**, conectar el repositorio, y confirmar que detecta `render.yaml`. Si se configura a mano:

- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`

- [ ] **Step 7: Verificar en producción**

Abrir la URL que asigna Render y comprobar: carga con HTTPS, el logo aparece, el menú funciona, el botón de WhatsApp abre la aplicación, y `/una-ruta-inventada` muestra el 404 propio.

**Hito: la empresa ya tiene un sitio que puede enseñar.**

---

# FASE 2 — Portafolio

### Task 8: Colección de obras

**Files:**
- Create: `src/content.config.ts`, `src/content/obras/<slug>.md` (una por obra real), `src/assets/obras/<slug>/*.jpg`

**Interfaces:**
- Consumes: nada.
- Produces: colección `obras` consultable con `getCollection('obras')`. Cada entrada tiene `.id` (el slug del archivo) y `.data` con los campos del esquema. La usan las Tasks 9, 10, 11 y 15.

- [ ] **Step 1: Definir el esquema**

Crear `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const obras = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/obras' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      categoria: z.enum(['acero-inoxidable', 'hierro', 'vidrio', 'construccion']),
      ciudad: z.string(),
      provincia: z.string(),
      anio: z.number().int().min(1990).max(2100),
      cliente: z.string().optional(),
      resumen: z.string().max(200),
      materiales: z.array(z.string()).min(1),
      reto: z.string(),
      solucion: z.string(),
      portada: image(),
      galeria: z.array(image()).default([]),
      destacada: z.boolean().default(false),
    }),
});

export const collections = { obras };
```

El esquema es la validación: si una obra queda sin `reto` o sin `portada`, el build falla y nunca se publica una ficha a medias.

- [ ] **Step 2: Cargar las fotos reales**

Copiar las fotografías a `src/assets/obras/<slug>/`, una carpeta por obra. Deben ir en `src/assets/`, no en `public/`: solo desde ahí `astro:assets` genera AVIF/WebP y `srcset`.

- [ ] **Step 3: Crear la primera obra**

Crear `src/content/obras/pasamanos-acero-quito.md`, ajustando los valores a la obra real:

```markdown
---
titulo: Pasamanos en acero inoxidable para escalera principal
categoria: acero-inoxidable
ciudad: Quito
provincia: Pichincha
anio: 2024
resumen: Pasamanos curvo de tres tramos en acero inoxidable satinado, con anclaje oculto.
materiales:
  - Acero inoxidable AISI 304
  - Vidrio templado 10 mm
reto: >-
  La escalera tenía un radio irregular en el descanso y el diseño original no permitía
  anclajes visibles en el mármol.
solucion: >-
  Se fabricaron los tramos curvos a medida en taller a partir del levantamiento en sitio,
  con un sistema de anclaje oculto en el canto de la grada.
portada: ../../assets/obras/pasamanos-acero-quito/portada.jpg
galeria:
  - ../../assets/obras/pasamanos-acero-quito/01.jpg
  - ../../assets/obras/pasamanos-acero-quito/02.jpg
destacada: true
---

Trabajo completo de fabricación e instalación, entregado en tres semanas.
```

Repetir para cada obra con material disponible. Marcar `destacada: true` en las tres o cuatro mejores.

- [ ] **Step 4: Verificar la validación**

```bash
npm run build
```

Esperado: build verde. Para comprobar que el esquema realmente protege, borrar temporalmente la línea `reto:` de una obra, correr `npm run build`, confirmar que **falla** indicando el campo faltante, y restaurarla.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: colección de obras con esquema validado y contenido real"
```

---

### Task 9: Índice del portafolio con filtro

**Files:**
- Create: `src/lib/obras.ts`, `src/components/TarjetaObra.astro`, `src/pages/obras/index.astro`
- Test: `src/lib/obras.test.ts`

**Interfaces:**
- Consumes: colección `obras`, `CATEGORIAS`, `Categoria`, `Layout.astro`.
- Produces:
  - `ordenarPorFecha<T>(obras: T[]): T[]` — más recientes primero.
  - `TarjetaObra.astro` con props `{ obra: CollectionEntry<'obras'> }`. La reutiliza la Task 11.

No hay función de filtrado en `src/lib/`: el filtro por categoría ocurre en el navegador ocultando tarjetas ya renderizadas, sin recalcular listas.

- [ ] **Step 1: Escribir el test**

Crear `src/lib/obras.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { ordenarPorFecha } from './obras';

const obra = (id: string, anio: number) => ({ id, data: { anio } });

const muestra = [obra('a', 2021), obra('b', 2024), obra('c', 2023)];

describe('ordenarPorFecha', () => {
  it('pone las obras más recientes primero', () => {
    expect(ordenarPorFecha(muestra).map((o) => o.id)).toEqual(['b', 'c', 'a']);
  });

  it('no muta el arreglo original', () => {
    const copia = [...muestra];
    ordenarPorFecha(muestra);
    expect(muestra).toEqual(copia);
  });
});
```

- [ ] **Step 2: Correr el test y ver que falla**

```bash
npm test
```

Esperado: FALLA con "Failed to resolve import './obras'".

- [ ] **Step 3: Implementar**

Crear `src/lib/obras.ts`:

```ts
type ConAnio = { data: { anio: number } };

export function ordenarPorFecha<T extends ConAnio>(obras: T[]): T[] {
  return [...obras].sort((a, b) => b.data.anio - a.data.anio);
}
```

- [ ] **Step 4: Correr el test y ver que pasa**

```bash
npm test
```

Esperado: los 2 tests PASAN.

- [ ] **Step 5: Crear la tarjeta de obra**

Crear `src/components/TarjetaObra.astro`:

```astro
---
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';
import { CATEGORIAS, type Categoria } from '../config';

interface Props {
  obra: CollectionEntry<'obras'>;
}

const { obra } = Astro.props;
const { titulo, categoria, ciudad, anio, resumen, portada } = obra.data;
---

<article class="reveal group" data-categoria={categoria}>
  <a href={`/obras/${obra.id}/`} class="block">
    <div class="relative aspect-[4/3] overflow-hidden bg-grafito">
      <Image
        src={portada}
        alt={`${titulo}, ${ciudad}`}
        widths={[400, 800]}
        sizes="(max-width: 768px) 100vw, 33vw"
        class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span class="absolute top-3 left-3 bg-carbon/85 px-3 py-1 text-xs text-ambar">
        {CATEGORIAS[categoria as Categoria]}
      </span>
    </div>

    <h3 class="mt-4 text-lg text-humo transition-colors group-hover:text-ambar">{titulo}</h3>
    <p class="mt-1 text-xs tracking-widest text-acero uppercase">{ciudad} · {anio}</p>
    <p class="mt-2 text-sm leading-relaxed text-acero">{resumen}</p>
  </a>
</article>
```

- [ ] **Step 6: Crear el índice con filtro**

Crear `src/pages/obras/index.astro`. El filtro se resuelve en el navegador ocultando tarjetas, sin recargar la página:

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import TarjetaObra from '../../components/TarjetaObra.astro';
import { ordenarPorFecha } from '../../lib/obras';
import { CATEGORIAS } from '../../config';

const obras = ordenarPorFecha(await getCollection('obras'));
const filtros: [string, string][] = [['todas', 'Todas'], ...Object.entries(CATEGORIAS)];
---

<Layout
  titulo="Obras realizadas — ConstruAceros"
  descripcion="Portafolio de trabajos en acero inoxidable, hierro, vidrio y construcción civil realizados en todo el Ecuador."
>
  <section class="mx-auto max-w-7xl px-6 pt-36 pb-24">
    <h1 class="text-5xl md:text-6xl">Obras realizadas</h1>
    <p class="mt-4 max-w-2xl text-acero">
      Cada trabajo entregado, con el detalle de lo que se resolvió.
    </p>

    <div class="mt-10 flex flex-wrap gap-3" role="group" aria-label="Filtrar obras por categoría">
      {filtros.map(([valor, texto]) => (
        <button
          type="button"
          data-filtro={valor}
          aria-pressed={valor === 'todas'}
          class="border border-white/15 px-4 py-2 text-sm text-acero transition-colors aria-pressed:border-ambar aria-pressed:bg-ambar aria-pressed:text-carbon"
        >
          {texto}
        </button>
      ))}
    </div>

    <div id="grid-obras" class="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
      {obras.map((obra) => <TarjetaObra obra={obra} />)}
    </div>

    <p id="sin-obras" class="mt-12 hidden text-acero">
      Todavía no hay obras publicadas en esta categoría.
    </p>
  </section>
</Layout>

<script>
  const botones = document.querySelectorAll<HTMLButtonElement>('[data-filtro]');
  const tarjetas = document.querySelectorAll<HTMLElement>('#grid-obras [data-categoria]');
  const aviso = document.getElementById('sin-obras');

  botones.forEach((boton) => {
    boton.addEventListener('click', () => {
      const filtro = boton.dataset.filtro!;
      botones.forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));

      let visibles = 0;
      tarjetas.forEach((t) => {
        const mostrar = filtro === 'todas' || t.dataset.categoria === filtro;
        t.hidden = !mostrar;
        if (mostrar) visibles++;
      });

      aviso?.classList.toggle('hidden', visibles > 0);
    });
  });
</script>
```

- [ ] **Step 7: Verificar y commit**

```bash
npm test && npm run build
```

En `npm run dev`, comprobar que los filtros ocultan y muestran las tarjetas y que el botón activo queda marcado.

```bash
git add -A
git commit -m "feat: índice del portafolio con filtro por categoría"
```

---

### Task 10: Página de detalle de obra

**Files:**
- Create: `src/pages/obras/[...slug].astro`, `src/components/Galeria.tsx`

**Interfaces:**
- Consumes: colección `obras`, `Layout.astro`, `CATEGORIAS`, `Categoria`.
- Produces: una ruta estática `/obras/<id>/` por cada entrada. `Galeria.tsx` recibe `{ imagenes: { src: string; alt: string }[] }`.

- [ ] **Step 1: Crear la galería con lightbox**

Crear `src/components/Galeria.tsx`. Es isla React porque necesita estado y captura de teclado:

```tsx
import { useEffect, useState } from 'react';

type Imagen = { src: string; alt: string };

export default function Galeria({ imagenes }: { imagenes: Imagen[] }) {
  const [abierta, setAbierta] = useState<number | null>(null);

  useEffect(() => {
    if (abierta === null) return;
    const alTeclado = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierta(null);
      if (e.key === 'ArrowRight') setAbierta((i) => (i === null ? null : (i + 1) % imagenes.length));
      if (e.key === 'ArrowLeft')
        setAbierta((i) => (i === null ? null : (i - 1 + imagenes.length) % imagenes.length));
    };
    window.addEventListener('keydown', alTeclado);
    return () => window.removeEventListener('keydown', alTeclado);
  }, [abierta, imagenes.length]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {imagenes.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setAbierta(i)}
            className="aspect-[4/3] overflow-hidden bg-grafito"
            aria-label={`Ampliar imagen ${i + 1} de ${imagenes.length}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {abierta !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada"
          className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/95 p-6"
          onClick={() => setAbierta(null)}
        >
          <img
            src={imagenes[abierta].src}
            alt={imagenes[abierta].alt}
            className="max-h-[90vh] max-w-full object-contain"
          />
          <button
            type="button"
            onClick={() => setAbierta(null)}
            aria-label="Cerrar"
            className="absolute top-6 right-6 text-3xl text-humo"
            autoFocus
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Crear la página de detalle**

Crear `src/pages/obras/[...slug].astro`:

```astro
---
import { getCollection, render, type CollectionEntry } from 'astro:content';
import { Image, getImage } from 'astro:assets';
import Layout from '../../layouts/Layout.astro';
import Galeria from '../../components/Galeria';
import { CATEGORIAS, type Categoria } from '../../config';

export async function getStaticPaths() {
  const obras = await getCollection('obras');
  return obras.map((obra) => ({ params: { slug: obra.id }, props: { obra } }));
}

interface Props {
  obra: CollectionEntry<'obras'>;
}

const { obra } = Astro.props;
const { titulo, categoria, ciudad, provincia, anio, cliente, materiales, reto, solucion, portada, galeria } =
  obra.data;
const { Content } = await render(obra);

// La isla React recibe URLs ya optimizadas, no los objetos de imagen de Astro.
const imagenesGaleria = await Promise.all(
  galeria.map(async (img, i) => ({
    src: (await getImage({ src: img, width: 1200, format: 'webp' })).src,
    alt: `${titulo}, imagen ${i + 1}`,
  })),
);
---

<Layout titulo={`${titulo} — ConstruAceros`} descripcion={obra.data.resumen}>
  <article>
    <div class="relative h-[60vh] min-h-96">
      <Image
        src={portada}
        alt={`${titulo}, ${ciudad}`}
        widths={[800, 1600]}
        sizes="100vw"
        class="h-full w-full object-cover"
        loading="eager"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/60 to-transparent"></div>

      <div class="absolute right-0 bottom-0 left-0 mx-auto max-w-7xl px-6 pb-12">
        <p class="text-sm tracking-[0.25em] text-ambar uppercase">
          {CATEGORIAS[categoria as Categoria]}
        </p>
        <h1 class="mt-3 max-w-4xl text-4xl md:text-6xl">{titulo}</h1>
      </div>
    </div>

    <div class="mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[2fr_1fr]">
      <div class="space-y-10">
        <section>
          <h2 class="text-2xl text-ambar">El reto</h2>
          <p class="mt-3 leading-relaxed text-acero">{reto}</p>
        </section>

        <section>
          <h2 class="text-2xl text-ambar">La solución</h2>
          <p class="mt-3 leading-relaxed text-acero">{solucion}</p>
        </section>

        <div class="leading-relaxed text-acero"><Content /></div>

        {imagenesGaleria.length > 0 && (
          <section>
            <h2 class="mb-5 text-2xl text-ambar">Galería</h2>
            <Galeria client:visible imagenes={imagenesGaleria} />
          </section>
        )}
      </div>

      <aside class="h-fit border border-white/15 p-7">
        <dl class="space-y-5 text-sm">
          <div>
            <dt class="text-xs tracking-widest text-acero uppercase">Ubicación</dt>
            <dd class="mt-1 text-humo">{ciudad}, {provincia}</dd>
          </div>
          <div>
            <dt class="text-xs tracking-widest text-acero uppercase">Año</dt>
            <dd class="mt-1 text-humo">{anio}</dd>
          </div>
          {cliente && (
            <div>
              <dt class="text-xs tracking-widest text-acero uppercase">Cliente</dt>
              <dd class="mt-1 text-humo">{cliente}</dd>
            </div>
          )}
          <div>
            <dt class="text-xs tracking-widest text-acero uppercase">Materiales</dt>
            <dd class="mt-1 text-humo">
              <ul class="space-y-1">{materiales.map((m) => <li>{m}</li>)}</ul>
            </dd>
          </div>
        </dl>

        <a href="/#contacto" class="mt-8 block bg-ambar px-6 py-3 text-center font-semibold text-carbon">
          Quiero algo así
        </a>
      </aside>
    </div>

    <div class="mx-auto max-w-7xl px-6 pb-20">
      <a href="/obras/" class="text-sm text-acero hover:text-ambar">← Volver a todas las obras</a>
    </div>
  </article>
</Layout>
```

- [ ] **Step 3: Verificar**

```bash
npm run build
```

Esperado: `dist/obras/<slug>/index.html` existe para cada obra. En `npm run dev`, abrir una obra y comprobar que la galería se abre, que `Escape` la cierra y que las flechas cambian de imagen.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: página de detalle por obra con galería accesible"
```

---

### Task 11: Obras destacadas en la landing

**Files:**
- Create: `src/components/ObrasDestacadas.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: colección `obras`, `ordenarPorFecha`, `TarjetaObra.astro`.
- Produces: sección con anclaje `#obras` en la landing.

- [ ] **Step 1: Crear la sección**

Crear `src/components/ObrasDestacadas.astro`:

```astro
---
import { getCollection } from 'astro:content';
import TarjetaObra from './TarjetaObra.astro';
import { ordenarPorFecha } from '../lib/obras';

const destacadas = ordenarPorFecha(
  await getCollection('obras', ({ data }) => data.destacada),
).slice(0, 6);
---

{destacadas.length > 0 && (
  <section id="obras" class="mx-auto max-w-7xl px-6 py-24">
    <div class="flex flex-wrap items-end justify-between gap-6">
      <div>
        <h2 class="text-4xl md:text-5xl">Obras destacadas</h2>
        <p class="mt-4 max-w-xl text-acero">
          Una muestra de lo entregado. Cada obra tiene su ficha con el detalle del trabajo.
        </p>
      </div>
      <a href="/obras/" class="border border-acero/40 px-6 py-3 text-sm font-semibold hover:border-ambar hover:text-ambar">
        Ver todas
      </a>
    </div>

    <div class="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
      {destacadas.map((obra) => <TarjetaObra obra={obra} />)}
    </div>
  </section>
)}
```

Si ninguna obra está marcada como destacada, la sección no se renderiza. Es preferible a mostrar un hueco vacío.

- [ ] **Step 2: Montar en la landing**

En `src/pages/index.astro`, añadir el import y colocar el componente entre `<Servicios />` y `<Proceso />`:

```astro
import ObrasDestacadas from '../components/ObrasDestacadas.astro';
```

```astro
  <Servicios />
  <ObrasDestacadas />
  <Proceso />
```

- [ ] **Step 3: Verificar y commit**

```bash
npm run build
git add -A
git commit -m "feat: sección de obras destacadas en la landing"
```

---

# FASE 3 — Movimiento

### Task 12: Reveals de scroll y contadores

**Files:**
- Create: `src/components/Trayectoria.astro`, `src/scripts/movimiento.ts`
- Modify: `src/layouts/Layout.astro`, `src/pages/index.astro`

**Interfaces:**
- Consumes: las clases `.reveal` / `.reveal-visible` de la Task 2, ya presentes en `Servicios.astro`, `Proceso.astro` y `TarjetaObra.astro`.
- Produces: script global que activa reveals y contadores. Los contadores se marcan con `data-contador="<número>"`.

- [ ] **Step 1: Escribir el script de movimiento**

Crear `src/scripts/movimiento.ts`:

```ts
const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Muestra los elementos .reveal al entrar en viewport. Una sola vez cada uno. */
function activarReveals() {
  const elementos = document.querySelectorAll<HTMLElement>('.reveal');

  if (sinMovimiento) {
    elementos.forEach((el) => el.classList.add('reveal-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('reveal-visible');
        observer.unobserve(e.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
  );

  elementos.forEach((el) => observer.observe(el));
}

/** Anima los contadores de 0 al valor final cuando entran en pantalla. */
function activarContadores() {
  const contadores = document.querySelectorAll<HTMLElement>('[data-contador]');

  if (sinMovimiento) {
    contadores.forEach((el) => (el.textContent = el.dataset.contador!));
    return;
  }

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        observer.unobserve(el);

        const destino = Number(el.dataset.contador);
        const duracion = 1400;
        const inicio = performance.now();

        const paso = (ahora: number) => {
          const avance = Math.min((ahora - inicio) / duracion, 1);
          // easeOutCubic: arranca rápido y frena al final.
          el.textContent = String(Math.round(destino * (1 - Math.pow(1 - avance, 3))));
          if (avance < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
      });
    },
    { threshold: 0.5 },
  );

  contadores.forEach((el) => observer.observe(el));
}

activarReveals();
activarContadores();
```

- [ ] **Step 2: Cargar el script en el layout**

En `src/layouts/Layout.astro`, justo antes de `</body>`:

```astro
    <BotonWhatsApp />
    <script>
      import '../scripts/movimiento';
    </script>
  </body>
```

- [ ] **Step 3: Crear la sección de trayectoria**

Crear `src/components/Trayectoria.astro`. Las cifras se reemplazan por las reales en la Task 16:

```astro
---
const cifras = [
  { valor: 20, sufijo: '+', etiqueta: 'Años de experiencia' },
  { valor: 150, sufijo: '+', etiqueta: 'Obras entregadas' },
  { valor: 12, sufijo: '', etiqueta: 'Provincias atendidas' },
  { valor: 100, sufijo: '%', etiqueta: 'Obras con garantía' },
];
---

<section class="border-y border-white/10 bg-grafito">
  <div class="mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:grid-cols-2 lg:grid-cols-4">
    {cifras.map((c) => (
      <div class="reveal text-center">
        <p class="font-display text-6xl text-ambar">
          <span data-contador={c.valor}>0</span>{c.sufijo}
        </p>
        <p class="mt-2 text-sm tracking-widest text-acero uppercase">{c.etiqueta}</p>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 4: Montar en la landing**

En `src/pages/index.astro`, importar `Trayectoria` y colocarla justo después de `<Hero />`.

- [ ] **Step 5: Verificar el comportamiento reducido**

```bash
npm run dev
```

Comprobar que los contadores suben al llegar a la sección. Luego activar "Reducir movimiento" en el sistema operativo, recargar, y confirmar que las cifras aparecen ya en su valor final sin animarse y que las secciones se ven sin desvanecido.

- [ ] **Step 6: Commit**

```bash
npm run build
git add -A
git commit -m "feat: reveals de scroll y contadores con movimiento reducido respetado"
```

---

### Task 13: Hero 3D en WebGL

**Files:**
- Create: `src/lib/render3d.ts`, `src/components/Hero3D.tsx`, `src/assets/hero-fallback.jpg`
- Test: `src/lib/render3d.test.ts`
- Modify: `src/components/Hero.astro`

**Interfaces:**
- Consumes: el contenedor `#hero-3d` creado en la Task 5.
- Produces: `permite3D(entorno: Entorno3D): boolean` y `entornoActual(): Entorno3D`, con `Entorno3D = { ancho: number; nucleos: number; movimientoReducido: boolean }`.

- [ ] **Step 1: Escribir el test de la decisión**

Crear `src/lib/render3d.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { permite3D } from './render3d';

const escritorio = { ancho: 1440, nucleos: 8, movimientoReducido: false };

describe('permite3D', () => {
  it('carga la escena en un escritorio capaz', () => {
    expect(permite3D(escritorio)).toBe(true);
  });

  it('no carga WebGL en pantallas de celular', () => {
    expect(permite3D({ ...escritorio, ancho: 390 })).toBe(false);
  });

  it('no carga WebGL en equipos de pocos núcleos', () => {
    expect(permite3D({ ...escritorio, nucleos: 4 })).toBe(false);
  });

  it('respeta la preferencia de movimiento reducido por encima de todo', () => {
    expect(permite3D({ ...escritorio, movimientoReducido: true })).toBe(false);
  });
});
```

- [ ] **Step 2: Correr el test y ver que falla**

```bash
npm test
```

Esperado: FALLA con "Failed to resolve import './render3d'".

- [ ] **Step 3: Implementar la decisión**

Crear `src/lib/render3d.ts`:

```ts
export type Entorno3D = {
  ancho: number;
  nucleos: number;
  movimientoReducido: boolean;
};

/**
 * Un cliente potencial con datos móviles no puede pagar 600 KB de WebGL.
 * Bajo estas condiciones se muestra la imagen de respaldo en su lugar.
 */
export function permite3D({ ancho, nucleos, movimientoReducido }: Entorno3D): boolean {
  if (movimientoReducido) return false;
  if (ancho < 768) return false;
  if (nucleos <= 4) return false;
  return true;
}

export function entornoActual(): Entorno3D {
  return {
    ancho: window.innerWidth,
    nucleos: navigator.hardwareConcurrency ?? 2,
    movimientoReducido: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
}
```

- [ ] **Step 4: Correr el test y ver que pasa**

```bash
npm test
```

Esperado: los 4 tests PASAN.

- [ ] **Step 5: Crear la escena**

Crear `src/components/Hero3D.tsx`. Una pieza metálica con material de acero inoxidable que rota lentamente y responde al scroll:

```tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useRef } from 'react';
import type { Mesh } from 'three';

function PiezaAcero() {
  const malla = useRef<Mesh>(null);

  useFrame((estado) => {
    if (!malla.current) return;
    // Rotación base continua más una inclinación ligada al scroll.
    malla.current.rotation.y = estado.clock.elapsedTime * 0.18 + window.scrollY * 0.0012;
    malla.current.rotation.x = 0.28 + window.scrollY * 0.0004;
  });

  return (
    <mesh ref={malla} position={[1.6, 0, 0]}>
      <torusKnotGeometry args={[1.15, 0.32, 220, 32]} />
      {/* Acero inoxidable satinado: metálico total, rugosidad baja. */}
      <meshStandardMaterial color="#C7CBD1" metalness={1} roughness={0.18} envMapIntensity={1.4} />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} color="#F2B705" />
      <directionalLight position={[-4, -2, -3]} intensity={1.1} color="#8fa0b5" />
      <PiezaAcero />
      {/* Los reflejos del entorno son lo que hace que el acero parezca acero. */}
      <Environment preset="warehouse" />
    </Canvas>
  );
}
```

`dpr` con tope 1.75 en vez del devicePixelRatio nativo: en pantallas Retina la diferencia visual es imperceptible y el costo de render se duplica.

- [ ] **Step 6: Añadir la imagen de respaldo**

Guardar en `src/assets/hero-fallback.jpg` una fotografía en horizontal de una obra en acero, con el mismo encuadre y tono oscuro que la escena 3D.

- [ ] **Step 7: Montar la escena condicionalmente**

En `src/components/Hero.astro`, añadir el import de la imagen en el frontmatter:

```astro
import { Image } from 'astro:assets';
import fallback from '../assets/hero-fallback.jpg';
```

Reemplazar el `<div id="hero-3d">` vacío por el bloque con respaldo:

```astro
  <div id="hero-3d" class="absolute inset-0" aria-hidden="true">
    <Image
      id="hero-respaldo"
      src={fallback}
      alt=""
      widths={[800, 1600]}
      sizes="100vw"
      class="h-full w-full object-cover opacity-60"
      loading="eager"
    />
  </div>
```

Y añadir al final del archivo:

```astro
<script>
  import { entornoActual, permite3D } from '../lib/render3d';

  if (permite3D(entornoActual())) {
    const [{ createRoot }, { createElement }, { default: Hero3D }] = await Promise.all([
      import('react-dom/client'),
      import('react'),
      import('./Hero3D'),
    ]);

    const contenedor = document.getElementById('hero-3d')!;
    document.getElementById('hero-respaldo')?.remove();
    createRoot(contenedor).render(createElement(Hero3D));
  }
</script>
```

Se monta a mano en lugar de usar `client:visible` porque la condición depende de valores que solo existen en el navegador. Así el bundle de React y Three ni siquiera se descarga cuando la respuesta es negativa.

- [ ] **Step 8: Verificar los dos caminos**

```bash
npm run dev
```

- En escritorio: la escena gira y reacciona al scroll.
- En las herramientas de desarrollo, emular un móvil y recargar: aparece la foto de respaldo y en la pestaña Network **no** se descarga `three`.
- Con movimiento reducido activo: aparece la foto de respaldo.

- [ ] **Step 9: Commit**

```bash
npm test && npm run build
git add -A
git commit -m "feat: hero 3D en WebGL con respaldo para dispositivos limitados"
```

---

### Task 14: Cobertura nacional

**Files:**
- Create: `src/components/Cobertura.astro`
- Modify: `src/pages/index.astro`, `src/config.ts`

**Interfaces:**
- Consumes: `PROVINCIAS_ATENDIDAS` de `src/config.ts`.
- Produces: sección con el listado de provincias.

- [ ] **Step 1: Añadir las provincias a la configuración**

En `src/config.ts`, añadir. Los valores se ajustan a los reales en la Task 16:

```ts
export const PROVINCIAS_ATENDIDAS = [
  'Pichincha',
  'Guayas',
  'Azuay',
  'Manabí',
  'Tungurahua',
  'Imbabura',
  'Santo Domingo',
  'Los Ríos',
] as const;
```

- [ ] **Step 2: Crear la sección**

Crear `src/components/Cobertura.astro`. Se implementa como listado y no como mapa SVG: un mapa provincial de Ecuador correcto pesa más de 100 KB de trazados y aporta menos que la lista de nombres, que además es legible por lector de pantalla y por buscadores.

```astro
---
import { PROVINCIAS_ATENDIDAS } from '../config';
---

<section class="mx-auto max-w-7xl px-6 py-24">
  <div class="grid gap-14 lg:grid-cols-2">
    <div>
      <h2 class="text-4xl md:text-5xl">Trabajamos en todo el Ecuador</h2>
      <p class="mt-4 max-w-xl text-acero">
        Nos movilizamos a la obra donde esté. Estas son las provincias donde ya hemos entregado
        trabajos, y la lista sigue creciendo.
      </p>
      <a href="/#contacto" class="mt-8 inline-block bg-ambar px-7 py-3 font-semibold text-carbon">
        Consultar por mi ciudad
      </a>
    </div>

    <ul class="grid grid-cols-2 gap-px self-start bg-white/10 sm:grid-cols-3">
      {PROVINCIAS_ATENDIDAS.map((p) => (
        <li class="reveal bg-carbon px-4 py-5 text-center text-sm text-acero">{p}</li>
      ))}
    </ul>
  </div>
</section>
```

- [ ] **Step 3: Montar en la landing**

En `src/pages/index.astro`, importar `Cobertura` y colocarla entre `<Proceso />` y `<Contacto />`.

- [ ] **Step 4: Verificar y commit**

```bash
npm run build
git add -A
git commit -m "feat: sección de cobertura nacional"
```

---

# FASE 4 — Cierre

### Task 15: SEO y datos estructurados

**Files:**
- Create: `src/components/Seo.astro`, `public/robots.txt`, `.env`
- Modify: `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/pages/obras/[...slug].astro`, `.gitignore`

**Interfaces:**
- Consumes: `EMPRESA`, `Astro.site`, `Astro.url`.
- Produces: `Seo.astro` con props `{ titulo: string; descripcion: string; imagen?: string; jsonLd?: Record<string, unknown> }`, usado por `Layout.astro`.

- [ ] **Step 1: Crear el componente SEO**

Crear `src/components/Seo.astro`:

```astro
---
import { EMPRESA } from '../config';

interface Props {
  titulo: string;
  descripcion: string;
  imagen?: string;
  jsonLd?: Record<string, unknown>;
}

const { titulo, descripcion, imagen, jsonLd } = Astro.props;
const canonica = new URL(Astro.url.pathname, Astro.site).href;
const imagenAbsoluta = imagen ? new URL(imagen, Astro.site).href : undefined;
---

<title>{titulo}</title>
<meta name="description" content={descripcion} />
<link rel="canonical" href={canonica} />

<meta property="og:type" content="website" />
<meta property="og:site_name" content={EMPRESA.nombre} />
<meta property="og:locale" content="es_EC" />
<meta property="og:title" content={titulo} />
<meta property="og:description" content={descripcion} />
<meta property="og:url" content={canonica} />
{imagenAbsoluta && <meta property="og:image" content={imagenAbsoluta} />}

<meta name="twitter:card" content={imagenAbsoluta ? 'summary_large_image' : 'summary'} />

{jsonLd && <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />}
```

- [ ] **Step 2: Conectar el layout**

En `src/layouts/Layout.astro`, ampliar las props y sustituir las etiquetas de título y descripción por el componente:

```astro
---
import Seo from '../components/Seo.astro';
// … imports existentes

interface Props {
  titulo: string;
  descripcion?: string;
  imagen?: string;
  jsonLd?: Record<string, unknown>;
}

const { titulo, descripcion = EMPRESA.descripcion, imagen, jsonLd } = Astro.props;
---
```

En el `<head>`, reemplazar `<title>{titulo}</title>` y `<meta name="description" … />` por:

```astro
    <Seo titulo={titulo} descripcion={descripcion} imagen={imagen} jsonLd={jsonLd} />
```

- [ ] **Step 3: Añadir LocalBusiness a la landing**

En el frontmatter de `src/pages/index.astro`:

```astro
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: EMPRESA.nombre,
  description: EMPRESA.descripcion,
  telephone: EMPRESA.telefono,
  email: EMPRESA.correo,
  url: Astro.site?.href,
  address: {
    '@type': 'PostalAddress',
    addressLocality: EMPRESA.ciudad,
    addressCountry: EMPRESA.pais,
  },
  areaServed: { '@type': 'Country', name: 'Ecuador' },
};
```

Y pasarlo al layout:

```astro
<Layout titulo={`${EMPRESA.nombre} — ${EMPRESA.bajada}`} jsonLd={jsonLd}>
```

- [ ] **Step 4: Añadir Service a cada obra**

En `src/pages/obras/[...slug].astro`, después de calcular `imagenesGaleria`:

```astro
const portadaOg = await getImage({ src: portada, width: 1200, format: 'jpeg' });

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: titulo,
  description: obra.data.resumen,
  serviceType: CATEGORIAS[categoria as Categoria],
  provider: { '@type': 'LocalBusiness', name: 'ConstruAceros' },
  areaServed: { '@type': 'City', name: ciudad },
};
```

Y ampliar la llamada al layout:

```astro
<Layout
  titulo={`${titulo} — ConstruAceros`}
  descripcion={obra.data.resumen}
  imagen={portadaOg.src}
  jsonLd={jsonLd}
>
```

- [ ] **Step 5: Crear robots.txt**

Crear `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://construaceros-web.onrender.com/sitemap-index.xml
```

- [ ] **Step 6: Conectar el formulario de verdad**

Crear la cuenta en web3forms.com con el correo de la empresa, obtener la access key y crear `.env` en la raíz:

```
PUBLIC_WEB3FORMS_KEY=la-llave-recibida
```

Confirmar que `.gitignore` incluye `.env` (el andamiaje de Astro ya lo agrega; si no, añadirlo). Registrar la misma variable en Render, en Environment del servicio.

- [ ] **Step 7: Verificar**

```bash
npm run build
```

Comprobar que `dist/sitemap-index.xml` existe y que `dist/index.html` contiene el bloque `application/ld+json`. Enviar el formulario en `npm run dev` y confirmar que el correo llega.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: SEO, datos estructurados y formulario conectado"
```

---

### Task 16: Auditoría final

**Files:**
- Modify: `src/config.ts`, `src/components/Trayectoria.astro`, y los que la auditoría señale.

**Interfaces:**
- Consumes: el sitio ya desplegado.
- Produces: sitio que cumple los criterios de éxito de la spec.

- [ ] **Step 1: Reemplazar los datos pendientes**

Buscar todos los valores sin resolver:

```bash
grep -rn "PENDIENTE:" src/
```

Reemplazar cada uno con el dato real que entregue el cliente. Ninguno debe sobrevivir a esta tarea. Ajustar también las cifras de `Trayectoria.astro` y la lista de `PROVINCIAS_ATENDIDAS` a los valores reales.

- [ ] **Step 2: Correr Lighthouse**

Sobre la URL de Render, no en local: el build local no mide la latencia de la CDN ni la compresión real.

```bash
npx lighthouse https://construaceros-web.onrender.com --view
```

Objetivo: 90 o más en las cuatro categorías en móvil. Si Rendimiento no llega, el sospechoso es siempre el peso de las fotografías; revisar que todas pasen por `astro:assets` y que ninguna portada supere los 1600 px de ancho.

- [ ] **Step 3: Revisar accesibilidad a mano**

Lighthouse no detecta estas cuatro cosas y hay que comprobarlas manualmente:

- Recorrer todo el sitio con Tab: el foco es siempre visible y el orden es lógico.
- Todas las fotos de obras tienen `alt` que describe el trabajo, no "imagen 1".
- El formulario se puede completar y enviar sin usar el mouse.
- Con "Reducir movimiento" activo no queda ninguna animación en pie, incluido el hero.

- [ ] **Step 4: Verificar el sitio en un celular real**

Abrir la URL en un teléfono con datos móviles, no en el emulador. Comprobar que carga rápido, que el menú es usable y que el botón de WhatsApp abre la aplicación con el mensaje ya escrito.

- [ ] **Step 5: Commit final**

```bash
npm test && npm run build
git add -A
git commit -m "fix: correcciones de la auditoría de accesibilidad y rendimiento"
git push
```

---

## Cobertura de la especificación

| Requisito de la spec | Tarea |
|---|---|
| §3 Stack completo | 1 |
| §4 Rutas y colección de obras | 8, 9, 10 |
| §4 Configuración central | 3 |
| §5.1 Hero 3D | 5, 13 |
| §5.2 Trayectoria con contadores | 12 |
| §5.3 Servicios | 5 |
| §5.4 Obras destacadas | 11 |
| §5.5 Cómo trabajamos | 5 |
| §5.6 Cobertura nacional | 14 |
| §5.7 Contacto | 6 |
| §5.8 Footer y crédito | 4 |
| §5 WhatsApp flotante | 4 |
| §6 Sistema visual | 2 |
| §7 Omisión del 3D | 13 |
| §7 Movimiento reducido | 2, 12, 13 |
| §7 Contraste, foco, teclado, alt | 2, 4, 16 |
| §7 Imágenes por astro:assets | 8, 9, 10 |
| §7 Reveals con IntersectionObserver | 12 |
| §8 Formulario y honeypot | 6 |
| §9 SEO y datos estructurados | 15 |
| §10 Despliegue en Render | 7 |
| §12 Datos pendientes resueltos | 16 |
| §13 Criterios de éxito | 16 |
