import { useState } from 'react'
import { Check } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from '../context/AuthContext'
import { DEFAULT_PREFS, type Preferences } from '../utils/preferences'

export default function SettingsPage() {
  const { user } = useAuth()
  const [saved, setSaved] = useLocalStorage<Preferences>('oscarcars_prefs', DEFAULT_PREFS)
  const [form, setForm] = useState<Preferences>(saved)
  const [showSaved, setShowSaved] = useState(false)

  const dirty = JSON.stringify(form) !== JSON.stringify(saved)

  const set = <K extends keyof Preferences>(key: K, value: Preferences[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  function handleSave() {
    setSaved(form)
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 2500)
  }

  function handleReset() {
    setForm(DEFAULT_PREFS)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Configuración</h1>
        <p className="text-sm text-slate-500">Ajusta cómo se muestra tu lista de autos.</p>
      </div>

      {/* Cuenta */}
      <div className="card max-w-2xl p-6">
        <h2 className="text-base font-bold text-slate-800">Cuenta</h2>
        <p className="text-sm text-slate-500">Datos asociados a tu sesión.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Nombre</label>
            <input className="input bg-slate-50" value={user?.name ?? ''} disabled />
          </div>
          <div>
            <label className="label">Correo</label>
            <input className="input bg-slate-50" value={user?.email ?? ''} disabled />
          </div>
        </div>
      </div>

      {/* Preferencias */}
      <div className="card max-w-2xl p-6">
        <h2 className="text-base font-bold text-slate-800">Visualización de autos</h2>
        <p className="text-sm text-slate-500">Se aplica a la pantalla de autos y se guarda en este navegador.</p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Autos por página</label>
            <select
              className="input"
              value={form.itemsPerPage}
              onChange={(e) => set('itemsPerPage', Number(e.target.value))}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Vista por defecto</label>
            <select
              className="input"
              value={form.defaultView}
              onChange={(e) => set('defaultView', e.target.value as Preferences['defaultView'])}
            >
              <option value="tabla">Tabla</option>
              <option value="tarjetas">Tarjetas</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button className="btn-primary" onClick={handleSave} disabled={!dirty}>
            Guardar cambios
          </button>
          <button className="btn-ghost" onClick={handleReset}>
            Restablecer
          </button>
          {showSaved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <Check size={16} /> Guardado
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
