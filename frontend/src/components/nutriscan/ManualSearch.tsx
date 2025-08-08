import React, { useState } from 'react';
import { Search, RotateCcw, Lightbulb, Frown } from 'lucide-react';

interface ManualSearchProps {
  onSearch: (productName: string) => void;
  onReset: () => void;
}

const ManualSearch: React.FC<ManualSearchProps> = ({ onSearch, onReset }) => {
  const [productName, setProductName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productName.trim()) {
      onSearch(productName.trim());
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-light-gray">
      <div className="text-center">
        {/* Error Icon */}
        <Frown className="w-12 h-12 text-wine-red mb-4 mx-auto" />

        {/* Error Message */}
        <h3 className="text-2xl font-bold text-wine-red mb-4 font-poppins">
          ¡Ups! No pudimos detectar el producto
        </h3>

        <p className="text-gray-600 mb-8 font-poppins max-w-md mx-auto">
          No pudimos detectar información del producto. Puedes escribir el nombre manualmente si lo deseas.
        </p>

        {/* Manual Search Input */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Ej: Manzana roja, Pollo a la plancha..."
            className="w-full px-4 py-3 rounded-xl border-2 border-light-gray focus:border-olive-green focus:outline-none text-gray-700 font-poppins text-base"
          />
        </form>

        {/* Action Buttons Together */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button
            onClick={onReset}
            className="bg-food-yellow hover:bg-food-yellow/90 text-olive-green px-6 py-3 rounded-xl font-semibold transition-colors duration-200 font-poppins flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Intentar con Otra Imagen
          </button>

          <button
            onClick={handleSubmit}
            disabled={!productName.trim()}
            className="bg-olive-green hover:bg-olive-green/90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 font-poppins flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Buscar Información Nutricional
          </button>
        </div>

         {/* Help Text */}
        <div className="mt-6 p-4 bg-olive-green/10 rounded-xl border border-olive-green/20 flex items-start gap-2 text-left">
          <Lightbulb className="w-5 h-5 text-olive-green mt-1" />
          <p className="text-sm text-gray-600 font-poppins">
            <strong>Consejo:</strong> Para mejores resultados, usa imágenes claras con buena iluminación y enfoque en el producto.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManualSearch;