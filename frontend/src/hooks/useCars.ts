import { useCallback, useEffect, useState } from 'react'
import * as carsApi from '../api/cars'
import type { Car, CarPayload } from '../types'

export function useCars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    carsApi
      .listCars()
      .then(setCars)
      .catch(() => setError('No se pudieron cargar los autos'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const create = async (payload: CarPayload) => {
    const car = await carsApi.createCar(payload)
    setCars((prev) => [car, ...prev])
  }

  const update = async (id: number, payload: CarPayload) => {
    const car = await carsApi.updateCar(id, payload)
    setCars((prev) => prev.map((c) => (c.id === id ? car : c)))
  }

  const remove = async (id: number) => {
    await carsApi.deleteCar(id)
    setCars((prev) => prev.filter((c) => c.id !== id))
  }

  return { cars, loading, error, reload, create, update, remove }
}
