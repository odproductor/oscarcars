import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, User } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/errors'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (name.trim().length < 2) return setError('Ingresa tu nombre completo')
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres')

    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password)
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo crear la cuenta'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Únete a Prueba Oscar" subtitle="Empieza a registrar tus autos">
      <h1 className="text-2xl font-bold text-slate-800">Crear cuenta</h1>
      <p className="mt-1 text-sm text-slate-500">Únete y empieza a registrar tus autos</p>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="label">Nombre completo</label>
          <div className="relative">
            <input
              className="input pr-10"
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div>
          <label className="label">Correo electrónico</label>
          <div className="relative">
            <input
              type="email"
              className="input pr-10"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div>
          <label className="label">Contraseña</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              className="input pr-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-brand-700 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  )
}
