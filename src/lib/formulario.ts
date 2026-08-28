export type ResultadoEnvio = { ok: true } | { ok: false; error: string };

const ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * Envía el formulario a Web3Forms. El parámetro `f` existe para poder testear
 * sin red; en producción se usa el fetch del navegador.
 */
export async function enviarFormulario(
  datos: Record<string, string>,
  accessKey: string,
  f: typeof fetch = fetch,
): Promise<ResultadoEnvio> {
  // Honeypot: un humano nunca llena este campo. Fingimos éxito para que el bot
  // no aprenda que fue detectado, pero no gastamos una petición.
  const { sitioWeb, ...limpios } = datos;
  if (sitioWeb) return { ok: true };

  try {
    const res = await f(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: accessKey, ...limpios }),
    });
    const json = (await res.json()) as { success?: boolean; message?: string };
    return json.success
      ? { ok: true }
      : { ok: false, error: json.message ?? 'No se pudo enviar el mensaje.' };
  } catch {
    return { ok: false, error: 'No hay conexión. Intente de nuevo o escríbanos por WhatsApp.' };
  }
}
