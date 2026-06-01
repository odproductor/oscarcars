import type { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  label: string
  value: string | number
  hint: string
  tone: 'violet' | 'green' | 'blue' | 'orange'
}

const tones: Record<Props['tone'], string> = {
  violet: 'bg-brand-100 text-brand-700',
  green: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-sky-100 text-sky-600',
  orange: 'bg-orange-100 text-orange-500',
}

export default function StatCard({ icon: Icon, label, value, hint, tone }: Props) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-extrabold text-slate-800">{value}</p>
        <p className="text-xs text-slate-400">{hint}</p>
      </div>
    </div>
  )
}
