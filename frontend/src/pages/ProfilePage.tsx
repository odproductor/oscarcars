import { Mail, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()

  const initials = user?.name
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Perfil</h1>
        <p className="text-sm text-slate-500">Información de tu cuenta.</p>
      </div>

      <div className="card max-w-xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white">
            {initials || 'U'}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <User size={18} className="text-slate-400" />
            <div>
              <p className="text-xs text-slate-400">Nombre completo</p>
              <p className="text-sm font-medium text-slate-700">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <Mail size={18} className="text-slate-400" />
            <div>
              <p className="text-xs text-slate-400">Correo electrónico</p>
              <p className="text-sm font-medium text-slate-700">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
