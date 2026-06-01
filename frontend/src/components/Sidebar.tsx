import { NavLink } from 'react-router-dom'
import { Car, LayoutDashboard, LogOut, Settings, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/autos', label: 'Mis Autos', icon: Car, end: false },
  { to: '/perfil', label: 'Perfil', icon: User, end: false },
  { to: '/configuracion', label: 'Configuración', icon: Settings, end: false },
]

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth()

  const initials = user?.name
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex h-full flex-col bg-sidebar text-slate-300">
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/20 text-brand-300">
            <Car size={22} />
          </div>
          <div>
            <p className="text-lg font-extrabold text-white">
              Prueba <span className="text-brand-400">Oscar</span>
            </p>
            <p className="text-[11px] text-slate-400">Tus autos, en un solo lugar</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 px-4">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/40'
                  : 'text-slate-400 hover:bg-sidebar-accent hover:text-slate-200'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Usuario */}
      <div className="m-4 rounded-2xl bg-sidebar-accent p-3">
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
            {initials || 'U'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
