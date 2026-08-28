# ConstruAceros Web

Sitio de ConstruAceros — construcciones en acero inoxidable, hierro y vidrio en Ecuador.

## Stack

Astro 5 · Tailwind CSS 4 · TypeScript · React Three Fiber · Vitest · Render Static Site

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
