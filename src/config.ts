const ANIO_FUNDACION = 2009;

/** Se recalcula en cada build: la cifra no envejece mal ni hay que acordarse de subirla. */
export const ANIOS_EXPERIENCIA = new Date().getFullYear() - ANIO_FUNDACION;

export const EMPRESA = {
  nombre: 'ConstruAceros',
  bajada: 'Construcciones en Acero Inoxidable',
  descripcion: `${ANIOS_EXPERIENCIA} años fabricando estructuras en acero inoxidable, hierro y vidrio en todo el Ecuador. Obra industrial, residencial y construcción civil.`,
  telefono: '+593 99 428 3675',
  whatsapp: '+593 99 428 3675',
  correo: 'caconstruacero@hotmail.com',
  horario: 'Atención: lunes a viernes de 08:00 a 18:00 y sábados de 09:00 a 15:00',
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

export const PROVINCIAS_ATENDIDAS = [
  'Pichincha',
  'Guayas',
  'Azuay',
  'Manabí',
  'Tungurahua',
  'Imbabura',
  'Santo Domingo',
  'Los Ríos',
] as const;
