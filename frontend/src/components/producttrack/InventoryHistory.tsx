import React, { useState } from 'react';
import InventoryHistoryCard from '../producttrack/InventoryHistoryCard';
import type { InventoryChange } from "../../types/Inventory";

interface InventoryHistoryProps {
  changes: InventoryChange[];
}

const InventoryHistory: React.FC<InventoryHistoryProps> = ({ changes }) => {
  const [filterAction, setFilterAction] = useState<'all' | 'added' | 'modified' | 'deleted'>('all');

  const sortedChanges = [...changes].sort((a, b) =>
    new Date(b.changeDate).getTime() - new Date(a.changeDate).getTime()
  );

  const filteredChanges = sortedChanges.filter((change) =>
    filterAction === 'all' ? true : change.action === filterAction
  );

  if (changes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Sin cambios registrados</h3>
        <p className="text-gray-500">Los cambios en el inventario aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Historial de Cambios</h2>

        {/* Contador de cambios */}
        <div className="bg-gray-100 px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-gray-600">
            {filteredChanges.length} {filteredChanges.length === 1 ? 'cambio' : 'cambios'}
          </span>
        </div>
      </div>

      {/* Filtro por tipo */}
      <div className="flex gap-3 flex-wrap mb-4">
        <button
          onClick={() => setFilterAction('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            filterAction === 'all' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilterAction('added')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            filterAction === 'added' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'
          }`}
        >
          Agregados
        </button>
        <button
          onClick={() => setFilterAction('modified')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            filterAction === 'modified' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
          }`}
        >
          Modificados
        </button>
        <button
          onClick={() => setFilterAction('deleted')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            filterAction === 'deleted' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'
          }`}
        >
          Eliminados
        </button>
      </div>

      {/* Tarjetas del historial */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {filteredChanges.map((change) => (
          <InventoryHistoryCard key={change.id} change={change} />
        ))}
      </div>
    </div>
  );
};

export default InventoryHistory;