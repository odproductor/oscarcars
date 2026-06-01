import api from './client'
import type { Car, CarPayload } from '../types'

export function listCars() {
  return api.get<Car[]>('/cars').then((r) => r.data)
}

export function createCar(payload: CarPayload) {
  return api.post<Car>('/cars', payload).then((r) => r.data)
}

export function updateCar(id: number, payload: CarPayload) {
  return api.put<Car>(`/cars/${id}`, payload).then((r) => r.data)
}

export function deleteCar(id: number) {
  return api.delete(`/cars/${id}`).then(() => undefined)
}
