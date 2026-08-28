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
