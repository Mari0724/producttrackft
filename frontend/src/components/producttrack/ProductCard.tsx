import React, { useState } from 'react';
import ProductActions from './ProductActions';
import { BadgeCheck, CalendarDays } from 'lucide-react';
import CommentsModal from '../individuales/CommentsModal';
import CompanyCommentsModal from '../empresarial/CompanyCommentsModal';
import type { Product } from '../../types/Product';

interface ProductCardProps {
  product: Product;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  rol?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onView,
  rol
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const {
    nombre,
    categoria,
    cantidad,
    fechaVencimiento,
    imagen,
    usuario,
  } = product;

  const tipoUsuario = (usuario?.tipoUsuario || 'INDIVIDUAL').toUpperCase();

  const isLowStock = tipoUsuario === 'EMPRESARIAL' ? cantidad <= 30 : cantidad <= 1;

  const getStockStyle = () => {
    return isLowStock
      ? 'bg-red-100 text-red-700 border border-red-300'
      : 'bg-green-100 text-green-700 border border-green-300';
  };

  const handleView = () => {
    setShowCommentsModal(true);
  };

  return (
    <>
      <div className="rounded-2xl bg-[#FFF5F7] p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 space-y-3 w-full">
        {imagen && (
          <img
            src={imagen}
            alt={nombre}
            className="w-full h-40 object-cover rounded-xl border border-gray-200"
          />
        )}

        <h3
          onClick={() => setShowDetails(!showDetails)}
          className="text-xl font-semibold text-[#81203D] cursor-pointer hover:underline"
        >
          {nombre}
        </h3>

        {showDetails && (
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-[#81203D]" />
              <p><strong>Categoría:</strong> {categoria}</p>
            </div>

            <div className={`inline-flex items-center gap-2 text-xs px-2 py-1 rounded-lg ${getStockStyle()}`}>
              Stock: {cantidad}
              {isLowStock && <span className="font-semibold ml-1">¡Bajo!</span>}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="w-4 h-4 text-[#81203D]" />
              <p>
                <strong>Vence:</strong>{" "}
                {fechaVencimiento ? new Date(fechaVencimiento).toISOString().split("T")[0] : "Sin fecha"}
              </p>
            </div>

            {/* Mostrar acciones solo si el producto es del usuario */}
            {(rol === "EDITOR" || rol === "COMENTARISTA") && (
              <ProductActions
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView ?? handleView}
                tipoUsuario={tipoUsuario}
                rol={rol}
              />
            )}
          </div>
        )}

        {/* Modal de comentarios según tipo de usuario */}
        {showCommentsModal && (
          tipoUsuario === 'INDIVIDUAL' ? (
            <CommentsModal
              productId={product.id!}
              productName={nombre}
              onClose={() => setShowCommentsModal(false)}
            />
          ) : (
            <CompanyCommentsModal
              productId={product.id!}
              productName={nombre}
              onClose={() => setShowCommentsModal(false)}
            />
          )
        )}
      </div>
    </>
  );
};

export default ProductCard;