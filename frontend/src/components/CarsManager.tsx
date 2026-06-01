import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  Calendar,
  Car as CarIcon,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Palette,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCars } from '../hooks/useCars'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { colorHex, DEFAULT_CAR_IMAGE } from '../utils/constants'
import { DEFAULT_PREFS, PREFS_KEY, type Preferences } from '../utils/preferences'
import StatCard from './StatCard'
import CarFormModal from './CarFormModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import type { Car, CarPayload } from '../types'

interface Props {
  showStats?: boolean
  showGreeting?: boolean
}

export default function CarsManager({ showStats, showGreeting }: Props) {
  const { user } = useAuth()
  const { cars, loading, error, create, update, remove } = useCars()

  // Preferencias guardadas en Configuración (vista por defecto y autos por página).
  const [prefs] = useLocalStorage<Preferences>(PREFS_KEY, DEFAULT_PREFS)

  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [brandFilter, setBrandFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [view, setView] = useState<Preferences['defaultView']>(prefs.defaultView)
  const [page, setPage] = useState(1)

  // Si cambian las preferencias, reflejar la vista elegida.
  useEffect(() => {
    setView(prefs.defaultView)
  }, [prefs.defaultView])

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Car | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Car | null>(null)
  const [deleting, setDeleting] = useState(false)

  const brands = useMemo(() => [...new Set(cars.map((c) => c.brand))].sort(), [cars])
  const years = useMemo(
    () => [...new Set(cars.map((c) => c.year))].sort((a, b) => b - a),
    [cars],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return cars.filter((c) => {
      const matchesSearch =
        !q ||
        c.plate.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q)
      const matchesBrand = !brandFilter || c.brand === brandFilter
      const matchesYear = !yearFilter || String(c.year) === yearFilter
      return matchesSearch && matchesBrand && matchesYear
    })
  }, [cars, search, brandFilter, yearFilter])

  const stats = useMemo(() => {
    const colors = new Set(cars.map((c) => c.color))
    const newest = cars.length ? Math.max(...cars.map((c) => c.year)) : '—'
    return { total: cars.length, newest, colors: colors.size }
  }, [cars])

  // Paginación según la preferencia "autos por página".
  const perPage = prefs.itemsPerPage
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * perPage, currentPage * perPage),
    [filtered, currentPage, perPage],
  )

  // Volver a la primera página cuando cambia la búsqueda o los filtros.
  useEffect(() => {
    setPage(1)
  }, [search, brandFilter, yearFilter])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(car: Car) {
    setEditing(car)
    setFormOpen(true)
  }

  async function handleSubmit(payload: CarPayload) {
    if (editing) await update(editing.id, payload)
    else await create(payload)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await remove(deleteTarget.id)
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Encabezado con saludo */}
      {showGreeting && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              ¡Hola, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm text-slate-500">Aquí tienes un resumen de tus autos.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-primary" onClick={openCreate}>
              <Plus size={18} /> Agregar auto
            </button>
            <button className="card flex h-11 w-11 items-center justify-center text-slate-500">
              <Bell size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Tarjetas de resumen */}
      {showStats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={CarIcon} tone="violet" label="Mis Autos" value={stats.total} hint="Autos registrados" />
          <StatCard icon={Calendar} tone="green" label="Más reciente" value={stats.newest} hint="Año del auto más nuevo" />
          <StatCard icon={Palette} tone="blue" label="Colores" value={stats.colors} hint="Colores diferentes" />
          <StatCard icon={CarIcon} tone="orange" label="Placas" value={stats.total} hint="Placas registradas" />
        </div>
      )}

      {/* Panel de autos */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Mis Autos</h2>
            <p className="text-sm text-slate-500">Lista de todos los autos que has registrado.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-9 sm:w-64"
                placeholder="Buscar auto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className={`btn-ghost ${showFilters ? 'ring-2 ring-brand-100' : ''}`}
              onClick={() => setShowFilters((v) => !v)}
            >
              <SlidersHorizontal size={16} /> Filtrar
            </button>
            {/* Cambio de vista tabla / tarjetas */}
            <div className="flex overflow-hidden rounded-xl border border-slate-200">
              <button
                className={`flex h-11 w-11 items-center justify-center transition ${
                  view === 'tabla' ? 'bg-brand-50 text-brand-700' : 'bg-white text-slate-400'
                }`}
                onClick={() => setView('tabla')}
                title="Vista de tabla"
              >
                <List size={18} />
              </button>
              <button
                className={`flex h-11 w-11 items-center justify-center transition ${
                  view === 'tarjetas' ? 'bg-brand-50 text-brand-700' : 'bg-white text-slate-400'
                }`}
                onClick={() => setView('tarjetas')}
                title="Vista de tarjetas"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
            {!showGreeting && (
              <button className="btn-primary" onClick={openCreate}>
                <Plus size={18} /> Agregar auto
              </button>
            )}
          </div>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="mt-4 flex flex-wrap gap-3 rounded-xl bg-slate-50 p-4">
            <select className="input sm:w-48" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
              <option value="">Todas las marcas</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select className="input sm:w-40" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
              <option value="">Todos los años</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            {(brandFilter || yearFilter) && (
              <button
                className="text-sm font-medium text-brand-700 hover:underline"
                onClick={() => {
                  setBrandFilter('')
                  setYearFilter('')
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Listado */}
        <div className="mt-5">
          {loading ? (
            <p className="py-10 text-center text-sm text-slate-400">Cargando autos...</p>
          ) : error ? (
            <p className="py-10 text-center text-sm text-red-500">{error}</p>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <CarIcon className="mx-auto mb-3 text-slate-300" size={40} />
              <p className="text-sm text-slate-500">
                {cars.length === 0
                  ? 'Aún no has registrado autos. ¡Agrega el primero!'
                  : 'No hay autos que coincidan con la búsqueda.'}
              </p>
            </div>
          ) : view === 'tabla' ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                    <th className="py-3 pr-4 font-semibold">Auto</th>
                    <th className="py-3 pr-4 font-semibold">Marca</th>
                    <th className="py-3 pr-4 font-semibold">Modelo</th>
                    <th className="py-3 pr-4 font-semibold">Año</th>
                    <th className="py-3 pr-4 font-semibold">Placa</th>
                    <th className="py-3 pr-4 font-semibold">Color</th>
                    <th className="py-3 pr-4 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((car) => (
                    <tr key={car.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="py-3 pr-4">
                        <img
                          src={car.photoUrl || DEFAULT_CAR_IMAGE}
                          alt={`${car.brand} ${car.model}`}
                          className="h-10 w-16 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_CAR_IMAGE
                          }}
                        />
                      </td>
                      <td className="py-3 pr-4 font-semibold text-slate-800">{car.brand}</td>
                      <td className="py-3 pr-4 text-slate-600">{car.model}</td>
                      <td className="py-3 pr-4 text-slate-600">{car.year}</td>
                      <td className="py-3 pr-4">
                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600">
                          {car.plate}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="inline-flex items-center gap-2 text-slate-600">
                          <span
                            className="h-3 w-3 rounded-full border border-slate-200"
                            style={{ backgroundColor: colorHex(car.color) }}
                          />
                          {car.color}
                        </span>
                      </td>
                      <td className="py-3 pr-0">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(car)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition hover:bg-brand-100"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(car)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Vista de tarjetas
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {paginated.map((car) => (
                <div key={car.id} className="overflow-hidden rounded-xl border border-slate-100">
                  <img
                    src={car.photoUrl || DEFAULT_CAR_IMAGE}
                    alt={`${car.brand} ${car.model}`}
                    className="h-36 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_CAR_IMAGE
                    }}
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-slate-800">
                          {car.brand} <span className="font-medium text-slate-500">{car.model}</span>
                        </p>
                        <p className="text-sm text-slate-400">{car.year}</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <span
                          className="h-3 w-3 rounded-full border border-slate-200"
                          style={{ backgroundColor: colorHex(car.color) }}
                        />
                        {car.color}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600">
                        {car.plate}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(car)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition hover:bg-brand-100"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(car)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Paginación */}
        {!loading && !error && filtered.length > 0 && (
          <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row">
            <p className="text-sm text-slate-500">
              Mostrando {(currentPage - 1) * perPage + 1}–
              {Math.min(currentPage * perPage, filtered.length)} de {filtered.length}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                      p === currentPage
                        ? 'bg-brand-600 text-white'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <CarFormModal
        open={formOpen}
        initial={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
      <ConfirmDeleteModal
        open={!!deleteTarget}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
