import { Trash2 } from 'lucide-react'
import Modal from './Modal'

interface Props {
  open: boolean
  loading?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmDeleteModal({ open, loading, onCancel, onConfirm }: Props) {
  return (
    <Modal open={open} onClose={onCancel} className="max-w-sm text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500">
        <Trash2 size={24} />
      </div>
      <h2 className="text-lg font-bold text-slate-800">¿Eliminar este auto?</h2>
      <p className="mt-2 text-sm text-slate-500">
        Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este auto?
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button className="btn-ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </Modal>
  )
}
