import type { ReactNode } from 'react'
import { Car } from 'lucide-react'

interface Props {
  title: string
  subtitle: string
  children: ReactNode
}

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        {/* Panel decorativo */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-sidebar via-brand-700/90 to-brand-500 p-10 text-white lg:flex">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Car size={22} />
            </div>
            <span className="text-lg font-extrabold">
              Prueba <span className="text-brand-200">Oscar</span>
            </span>
          </div>

          <Car size={120} className="mx-auto text-white/15" strokeWidth={1} />

          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-1 text-sm text-white/70">{subtitle}</p>
          </div>
        </div>

        {/* Formulario */}
        <div className="p-8 sm:p-10">{children}</div>
      </div>
    </div>
  )
}
