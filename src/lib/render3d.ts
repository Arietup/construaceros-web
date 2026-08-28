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
