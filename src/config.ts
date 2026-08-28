export const EMPRESA = {
  nombre: 'ConstruAceros',
  bajada: 'Construcciones en Acero Inoxidable',
  descripcion:
    'Más de 20 años fabricando estructuras en acero inoxidable, hierro y vidrio en todo el Ecuador. Obra industrial, residencial y construcción civil.',
  telefono: 'PENDIENTE:+593000000000',
  whatsapp: 'PENDIENTE:+593000000000',
  correo: 'PENDIENTE:correo@construaceros.ec',
  direccion: 'PENDIENTE:dirección',
  horario: 'Lunes a viernes, 08:00 a 17:00',
  ciudad: 'Quito',
  pais: 'EC',
  redes: {
    facebook: '',
    instagram: '',
  },
  /** Pública por diseño. Web3Forms la valida contra el correo de destino. */
  web3formsKey: import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '',
} as const;

export const MENSAJE_WHATSAPP =
  'Hola, vi su página web y quisiera información sobre un trabajo en acero.';

export const NAV = [
  { href: '/#servicios', texto: 'Servicios' },
  { href: '/obras/', texto: 'Obras' },
  { href: '/#proceso', texto: 'Cómo trabajamos' },
  { href: '/#contacto', texto: 'Contacto' },
] as const;

export const CATEGORIAS = {
  'acero-inoxidable': 'Acero inoxidable',
  hierro: 'Estructuras en hierro',
  vidrio: 'Vidrio templado',
  construccion: 'Construcción civil',
} as const;

export type Categoria = keyof typeof CATEGORIAS;
