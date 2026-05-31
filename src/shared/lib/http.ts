/** Erreur réseau/HTTP normalisée, exploitable par l'UI (états error + retry). */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * GET JSON typé, avec gestion d'erreur homogène.
 * On ne renvoie jamais une réponse brute non vérifiée à l'appelant.
 */
export async function httpGetJson<T>(
  url: string,
  signal?: AbortSignal,
): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw new ApiError('Réseau indisponible. Vérifiez votre connexion.')
  }

  if (!response.ok) {
    throw new ApiError(
      `La requête a échoué (HTTP ${response.status}).`,
      response.status,
    )
  }

  return (await response.json()) as T
}
