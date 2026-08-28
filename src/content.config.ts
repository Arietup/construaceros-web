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
      galeria: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      destacada: z.boolean().default(false),
    }),
});

export const collections = { obras };
