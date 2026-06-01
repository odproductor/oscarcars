import CarsManager from '../components/CarsManager'

export default function AutosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Mis Autos</h1>
        <p className="text-sm text-slate-500">Administra todos los autos de tu cuenta.</p>
      </div>
      <CarsManager />
    </div>
  )
}
