type ConAnio = { data: { anio: number } };

export function ordenarPorFecha<T extends ConAnio>(obras: T[]): T[] {
  return [...obras].sort((a, b) => b.data.anio - a.data.anio);
}
