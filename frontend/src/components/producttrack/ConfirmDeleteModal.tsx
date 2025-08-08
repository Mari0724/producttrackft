import React from 'react'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  productName: string
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  productName
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold text-[#81203D] mb-4">¿Eliminar producto?</h2>
        <p className="text-gray-700 mb-6">
          ¿Estás seguro de que quieres eliminar <strong>{productName}</strong>? Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#81203D] text-white hover:bg-[#60162F] px-4 py-2 rounded text-sm"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal