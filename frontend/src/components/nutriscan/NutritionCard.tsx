import React from 'react';
import { UtensilsCrossed, Info, Lightbulb } from 'lucide-react';

interface NutritionData {
  food: string;
  calories?: number;
  nutritionInfo: string;
}

interface NutritionCardProps {
  data: NutritionData;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-light-gray overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-olive-green to-food-yellow p-6 text-white">
        <div className="text-center">
          <div className="text-4xl mb-2 flex justify-center">
            <UtensilsCrossed className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold font-poppins">{data.food}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Calories Section - Only show if available */}
        {data.calories && (
          <div className="text-center bg-food-yellow/10 rounded-xl p-4 border border-food-yellow/20">
            <div className="text-3xl font-bold text-olive-green font-poppins mb-1">
              {data.calories} calorías
            </div>
            <div className="text-sm text-gray-600 font-poppins">por porción</div>
          </div>
        )}

        {/* Nutritional Information */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-wine-red font-poppins flex items-center gap-2">
            <Info className="w-5 h-5 text-wine-red" />
            Información Nutricional
          </h4>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-700 font-poppins leading-relaxed text-base">
              {data.nutritionInfo}
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-olive-green/10 rounded-xl p-4 border border-olive-green/20">
          <p className="text-sm text-gray-600 text-center font-poppins leading-relaxed flex items-center justify-center gap-2">
            <Lightbulb className="w-4 h-4 text-olive-green" />
            <strong>Nota:</strong> La información nutricional es generada por inteligencia artificial y puede variar según la preparación y los ingredientes específicos utilizados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NutritionCard;