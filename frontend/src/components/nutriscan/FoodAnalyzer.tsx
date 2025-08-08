import { useState } from 'react';
import ImageUpload from './ImageUpload';
import ProcessingState from './ProcessingState';
import NutritionCard from './NutritionCard';
import ManualSearch from './ManualSearch';
import { ShoppingBasket, Search, RotateCcw, ImagePlus } from 'lucide-react';

export interface NutritionData {
  food: string;
  calories?: number;
  nutritionInfo: string;
}

export interface RespuestaNutriScan {
  mensajeGPT: string;
  requiereConfirmacion: boolean;
  sugerencia?: string;
  registro: {
    id: number;
    consulta: string;
  };
}

interface FoodAnalyzerProps {
  analizarImagen: (base64: string, token: string, nombreManual?: string) => Promise<RespuestaNutriScan>;
  confirmarConsulta?: (id: number, nombreConfirmado: string, token: string) => Promise<RespuestaNutriScan>;
}

const FoodAnalyzer = ({ analizarImagen, confirmarConsulta }: FoodAnalyzerProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [hasError, setHasError] = useState(false);
  const [lastRegistroId, setLastRegistroId] = useState<number | null>(null);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setNutritionData(null);
    setHasError(false);
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setHasError(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const result = await analizarImagen(selectedImage, token);

      if (result?.requiereConfirmacion) {
        setHasError(true);
        setLastRegistroId(result.registro.id);
        return;
      }

      if (
        typeof result === "object" &&
        result !== null &&
        "mensajeGPT" in result &&
        "registro" in result &&
        typeof result.mensajeGPT === "string"
      ) {
        const data: NutritionData = {
          food: result.sugerencia || result.registro.consulta,
          nutritionInfo: result.mensajeGPT,
        };
        setNutritionData(data);
      } else {
        throw new Error("Respuesta inválida del backend");
      }
    } catch (error) {
      console.error("Error en análisis:", error);
      setHasError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSearch = async (productName: string) => {
    setIsProcessing(true);
    setHasError(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      if (!confirmarConsulta || lastRegistroId === null) {
        throw new Error("No se puede confirmar sin un ID de registro válido");
      }

      const result = await confirmarConsulta(lastRegistroId, productName, token);

      if (
        typeof result === "object" &&
        result !== null &&
        "mensajeGPT" in result &&
        typeof result.mensajeGPT === "string"
      ) {
        const data: NutritionData = {
          food: productName,
          nutritionInfo: result.mensajeGPT,
        };
        setNutritionData(data);
        setSelectedImage(null);
        setLastRegistroId(null);
      } else {
        throw new Error("Respuesta inválida del backend");
      }
    } catch (error) {
      console.error("Error en búsqueda manual:", error);
      setHasError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setNutritionData(null);
    setIsProcessing(false);
    setHasError(false);
    setLastRegistroId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive-green/10 to-food-yellow/10 py-8 px-4">

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ShoppingBasket size={48} className="text-wine-red" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-wine-red mb-2 font-poppins">
            NutriScan
          </h1>
          <p className="text-lg text-gray-600 font-poppins">
            Analiza la información nutricional de tus alimentos con inteligencia artificial
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {!selectedImage && !isProcessing && !nutritionData && !hasError && (
            <ImageUpload onImageSelect={handleImageSelect} />
          )}

          {selectedImage && !isProcessing && !nutritionData && !hasError && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-light-gray">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-wine-red mb-4 font-poppins">
                  Imagen seleccionada
                </h3>
                <div className="mb-6">
                  <img
                    src={selectedImage}
                    alt="Comida seleccionada"
                    className="max-w-full h-64 object-cover rounded-lg mx-auto border-2 border-light-gray"
                  />
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleAnalyzeImage}
                    className="bg-olive-green hover:bg-olive-green/90 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 font-poppins flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Analizar Imagen
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 font-poppins flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Cambiar Imagen
                  </button>
                </div>
              </div>
            </div>
          )}

          {isProcessing && <ProcessingState />}

          {hasError && !isProcessing && (
            <ManualSearch onSearch={handleManualSearch} onReset={handleReset} />
          )}

          {nutritionData && (
            <div className="space-y-6">
              <NutritionCard data={nutritionData} />
              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="bg-wine-red hover:bg-wine-red/90 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 font-poppins flex items-center gap-2"
                >
                  <ImagePlus className="w-5 h-5" />
                  Analizar Nueva Imagen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodAnalyzer;