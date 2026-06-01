import { AxiosError } from 'axios'
import type { ApiError } from '../types'

/** Extrae un mensaje legible del error que devuelve el backend. */
export function getErrorMessage(err: unknown, fallback = 'Ocurrio un error'): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data as ApiError | undefined
    if (data?.fields) {
      // Devolvemos el primer error de validacion por campo.
      const first = Object.values(data.fields)[0]
      if (first) return first
    }
    if (data?.message) return data.message
  }
  return fallback
}
