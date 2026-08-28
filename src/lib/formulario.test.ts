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
