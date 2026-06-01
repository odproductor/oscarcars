import { useEffect, useState, type FormEvent } from 'react'
import { Car as CarIcon } from 'lucide-react'
import Modal from './Modal'
import { CAR_BRANDS, CAR_COLORS } from '../utils/constants'
import { getErrorMessage } from '../utils/errors'
import type { Car, CarPayload } from '../types'

interface Props {
  open: boolean
  initial?: Car | null
  onClose: () => void
  onSubmit: (payload: CarPayload) => Promise<void>
}

type FormState = {
  brand: string
  model: string
  year: string
  plate: string
  color: string
  photoUrl: string
}

const empty: FormState = { brand: '', model: '', year: '', plate: '', color: '', photoUrl: '' }
const PLATE_RE = /^[A-Za-z]{3}-?[0-9]{3,4}$/

export default function CarFormModal({ open, initial, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setErrors({})
      setServerError(null)
      setForm(
        initial
          ? {
              brand: initial.brand,
              model: initial.model,
              year: String(initial.year),
              plate: initial.plate,
              color: initial.color,
              photoUrl: initial.photoUrl ?? '',
            }
          : empty,
      )
    }
  }, [open, initial])

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {}
    const currentYear = new Date().getFullYear()
    const yearNum = Number(form.year)

    if (!form.brand.trim()) e.brand = 'Selecciona una marca'
    if (!form.model.trim()) e.model = 'Ingresa el modelo'
    if (!form.year) e.year = 'Ingresa el año'
    else if (Number.isNaN(yearNum) || yearNum < 1900) e.year = 'Año inválido'
    else if (yearNum > currentYear) e.year = `El año no puede ser futuro (máx ${currentYear})`
    if (!form.plate.trim()) e.plate = 'Ingresa la placa'
    else if (!PLATE_RE.test(form.plate.trim())) e.plate = 'Formato inválido (ej: ABC-123)'
    if (!form.color.trim()) e.color = 'Selecciona un color'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setSaving(true)
    setServerError(null)
    try {
      await onSubmit({
        brand: form.brand.trim(),
        model: form.model.trim(),
        year: Number(form.year),
        plate: form.plate.trim().toUpperCase(),
        color: form.color.trim(),
        photoUrl: form.photoUrl.trim() || null,
      })
      onClose()
    } catch (err) {
      setServerError(getErrorMessage(err, 'No se pudo guardar el auto'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-2xl">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
          <CarIcon size={22} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {initial ? 'Editar auto' : 'Agregar auto'}
          </h2>
          <p className="text-sm text-slate-500">Completa la información de tu auto</p>
        </div>
      </div>

      {serverError && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Marca</label>
          <select
            className="input"
            value={form.brand}
            onChange={(e) => set('brand', e.target.value)}
          >
            <option value="">Ej. Toyota</option>
            {CAR_BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {errors.brand && <p className="mt-1 text-xs text-red-500">{errors.brand}</p>}
        </div>

        <div>
          <label className="label">Número de placa</label>
          <input
            className="input"
            placeholder="Ej. ABC-123"
            value={form.plate}
            onChange={(e) => set('plate', e.target.value)}
          />
          {errors.plate && <p className="mt-1 text-xs text-red-500">{errors.plate}</p>}
        </div>

        <div>
          <label className="label">Modelo</label>
          <input
            className="input"
            placeholder="Ej. Corolla"
            value={form.model}
            onChange={(e) => set('model', e.target.value)}
          />
          {errors.model && <p className="mt-1 text-xs text-red-500">{errors.model}</p>}
        </div>

        <div>
          <label className="label">Color</label>
          <select
            className="input"
            value={form.color}
            onChange={(e) => set('color', e.target.value)}
          >
            <option value="">Selecciona un color</option>
            {CAR_COLORS.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.color && <p className="mt-1 text-xs text-red-500">{errors.color}</p>}
        </div>

        <div>
          <label className="label">Año</label>
          <input
            type="number"
            className="input"
            placeholder="Ej. 2023"
            value={form.year}
            onChange={(e) => set('year', e.target.value)}
          />
          {errors.year && <p className="mt-1 text-xs text-red-500">{errors.year}</p>}
        </div>

        <div>
          <label className="label">Foto (URL, opcional)</label>
          <input
            className="input"
            placeholder="https://..."
            value={form.photoUrl}
            onChange={(e) => set('photoUrl', e.target.value)}
          />
        </div>

        <div className="col-span-full mt-2 flex justify-end gap-3">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar auto'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
