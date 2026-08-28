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
