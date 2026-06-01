export interface User {
  id: number
  name: string
  email: string
}

export interface AuthResponse {
  token: string
  type: string
  user: User
}

export interface Car {
  id: number
  brand: string
  model: string
  year: number
  plate: string
  color: string
  photoUrl: string | null
}

// Lo que enviamos al crear/editar un auto
export type CarPayload = Omit<Car, 'id'>

// Forma del error que devuelve el backend
export interface ApiError {
  status: number
  error: string
  message: string
  fields?: Record<string, string>
}
