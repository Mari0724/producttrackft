import React from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

interface ProductActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView: () => void;
  tipoUsuario: string;
  rol?: string;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  onEdit,
  onDelete,
  onView,
  tipoUsuario,
  rol,
}) => {
  const isIndividual = tipoUsuario === 'INDIVIDUAL';

  const viewLabel = isIndividual ? 'Notas personales' : 'Ver más';
  const viewColor = isIndividual
    ? 'bg-[#81203D] hover:bg-[#60162F]'
    : 'bg-gray-700 hover:bg-gray-800';

  return (
    <div className="flex gap-3 pt-3 text-white">
      {rol === "EDITOR" && (
        <>
          <button
            onClick={onEdit}
            className="flex items-center gap-1 bg-[#81203D] hover:bg-[#60162F] px-3 py-1.5 rounded-lg text-sm"
          >
            <FaEdit /> Editar
          </button>

          <button
            onClick={onDelete}
            className="flex items-center gap-1 bg-[#FFBA00] hover:bg-[#E6A700] px-3 py-1.5 rounded-lg text-sm text-black"
          >
            <FaTrash /> Eliminar
          </button>
        </>
      )}

      {/* Mostrar botón para ver notas si es INDIVIDUAL o si tiene permiso */}
      {(rol === "EDITOR" || rol === "COMENTARISTA" || isIndividual) && (
        <button
          onClick={onView}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white ${viewColor}`}
        >
          <FaEye /> {viewLabel}
        </button>
      )}
    </div>
  );
};

export default ProductActions;