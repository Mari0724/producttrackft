import React from 'react';
import { Plus, Minus, X } from 'lucide-react';
import type { InventoryChange } from "../../types/Inventory";

interface InventoryHistoryCardProps {
  change: InventoryChange;
}

const InventoryHistoryCard: React.FC<InventoryHistoryCardProps> = ({ change }) => {
  const getActionConfig = (action: InventoryChange["action"]) => {
    switch (action) {
      case 'added':
        return {
          icon: Plus,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          textColor: 'text-green-700',
          label: 'Agregado'
        };
      case 'modified':
        return {
          icon: Minus,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-700',
          label: 'Modificado'
        };
      case 'deleted':
        return {
          icon: X,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          textColor: 'text-red-700',
          label: 'Eliminado'
        };
      default:
        return {
          icon: Plus,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          textColor: 'text-gray-700',
          label: 'Desconocido'
        };
    }
  };

  const config = getActionConfig(change.action);
  const IconComponent = config.icon;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatPrice = (price?: number) => {
    if (price === undefined) return '-';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 hover:shadow-md transition-all duration-200 animate-fade-in`}>
      {/* Header con ícono y acción */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`${config.iconBg} p-2 rounded-full`}>
            <IconComponent size={16} className={config.iconColor} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{change.productName}</h3>
            <span className={`text-sm font-medium ${config.textColor}`}>
              {config.label}
            </span>
          </div>
        </div>
        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
          {formatDate(change.changeDate)}
        </span>
      </div>

      {/* Detalles de cambios */}
      {change.action !== 'added' && change.action !== 'deleted' && (
        <div className="space-y-2">
          {/* Cambios de cantidad */}
          {(change.previousQuantity !== undefined || change.newQuantity !== undefined) && (
            <div className="bg-white rounded-md p-3">
              <div className="text-xs font-medium text-gray-600 mb-1">Cantidad</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Anterior: <span className="font-medium">{change.previousQuantity || 0}</span>
                </span>
                <span className="text-sm text-gray-400">→</span>
                <span className="text-sm text-gray-900">
                  Nueva: <span className="font-medium">{change.newQuantity || 0}</span>
                </span>
              </div>
            </div>
          )}

          {/* Cambios de precio */}
          {(change.previousPrice !== undefined || change.newPrice !== undefined) && (
            <div className="bg-white rounded-md p-3">
              <div className="text-xs font-medium text-gray-600 mb-1">Precio</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Anterior: <span className="font-medium">{formatPrice(change.previousPrice)}</span>
                </span>
                <span className="text-sm text-gray-400">→</span>
                <span className="text-sm text-gray-900">
                  Nuevo: <span className="font-medium">{formatPrice(change.newPrice)}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Para elementos agregados, mostrar valores iniciales */}
      {change.action === 'added' && (
        <div className="bg-white rounded-md p-3">
          <div className="flex justify-between items-center">
            {change.newQuantity !== undefined && (
              <div className="text-center">
                <div className="text-xs text-gray-600">Cantidad</div>
                <div className="font-semibold text-green-600">{change.newQuantity}</div>
              </div>
            )}
            {change.newPrice !== undefined && (
              <div className="text-center">
                <div className="text-xs text-gray-600">Precio</div>
                <div className="font-semibold text-green-600">{formatPrice(change.newPrice)}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Para elementos eliminados, mostrar valores finales */}
      {change.action === 'deleted' && (
        <div className="bg-white rounded-md p-3">
          <div className="flex justify-between items-center">
            {change.previousQuantity !== undefined && (
              <div className="text-center">
                <div className="text-xs text-gray-600">Cantidad final</div>
                <div className="font-semibold text-red-600">{change.previousQuantity}</div>
              </div>
            )}
            {change.previousPrice !== undefined && (
              <div className="text-center">
                <div className="text-xs text-gray-600">Precio final</div>
                <div className="font-semibold text-red-600">{formatPrice(change.previousPrice)}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryHistoryCard;