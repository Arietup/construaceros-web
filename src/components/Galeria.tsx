import { useEffect, useRef, useState } from 'react';

type Imagen = { src: string; alt: string };

export default function Galeria({ imagenes }: { imagenes: Imagen[] }) {
  const [abierta, setAbierta] = useState<number | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);

  // showModal() da foco atrapado, cierre con Escape, fondo inerte y
  // devolución del foco al disparador. Nada de eso hay que programarlo.
  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierta !== null && !d.open) d.showModal();
    if (abierta === null && d.open) d.close();
  }, [abierta]);

  const mover = (paso: number) =>
    setAbierta((i) => (i === null ? null : (i + paso + imagenes.length) % imagenes.length));

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

      <dialog
        ref={dialogo}
        aria-label="Imagen ampliada"
        // onClose cubre también el Escape del navegador, que no pasa por onClick.
        onClose={() => setAbierta(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') mover(1);
          if (e.key === 'ArrowLeft') mover(-1);
        }}
        // Clic en el fondo: solo si el objetivo es el propio <dialog>, no su contenido.
        onClick={(e) => {
          if (e.target === dialogo.current) setAbierta(null);
        }}
        className="max-h-none max-w-none bg-transparent p-0 backdrop:bg-carbon/95"
      >
        {abierta !== null && (
          <div className="flex h-screen w-screen items-center justify-center p-6">
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
            >
              ×
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
