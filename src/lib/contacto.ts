/** wa.me exige el número sin signos ni espacios, y el mensaje URL-encoded. */
export function whatsappUrl(numero: string, mensaje: string): string {
  const digitos = numero.replace(/\D/g, '');
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje)}`;
}

export function telefonoUrl(numero: string): string {
  return `tel:${numero.replace(/[^\d+]/g, '')}`;
}
