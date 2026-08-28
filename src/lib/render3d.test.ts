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
