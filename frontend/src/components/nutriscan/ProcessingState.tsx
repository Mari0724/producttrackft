import { ScanFace } from 'lucide-react';

const ProcessingState = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-light-gray">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-block animate-bounce-gentle text-6xl mb-4">
            <ScanFace className="w-16 h-16 text-olive-green" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-olive-green mb-4 font-poppins">
          Analizando tu comida...
        </h3>
        
        <p className="text-gray-600 mb-8 font-poppins">
          Estamos procesando la imagen para extraer la información nutricional
        </p>
        
        {/* Barra de progreso animada */}
        <div className="max-w-md mx-auto mb-6">
          <div className="bg-light-gray rounded-full h-3 overflow-hidden">
            <div className="bg-gradient-to-r from-food-yellow to-olive-green h-full rounded-full animate-pulse-slow"></div>
          </div>
        </div>
        
        {/* Pasos del procesamiento */}
        <div className="space-y-3 text-left max-w-sm mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-olive-green rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 font-poppins">Detectando alimentos...</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-food-yellow rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span className="text-sm text-gray-600 font-poppins">Calculando nutrientes...</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-wine-red rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span className="text-sm text-gray-600 font-poppins">Generando reporte...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingState;