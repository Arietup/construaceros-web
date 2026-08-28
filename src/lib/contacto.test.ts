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
