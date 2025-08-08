import React, { useRef } from 'react';
import { Camera, Upload, ImagePlus, Image, Ruler } from 'lucide-react';
import { resizeImage } from '../../utils/resizeImage';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resizedBase64 = await resizeImage(file, 800); // 800px de ancho máximo
        onImageSelect(resizedBase64);
      } catch (error) {
        console.error("Error al redimensionar la imagen:", error);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-light-gray">
      <div className="text-center">
        <ImagePlus className="w-10 h-10 text-wine-red mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-wine-red mb-2 font-poppins">
          Sube una foto de tu producto
        </h2>
        <p className="text-gray-600 mb-8 font-poppins">
          Toma una foto con tu cámara o selecciona una imagen de tu galería
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
          {/* Botón de Cámara */}
          <button
            onClick={handleCameraClick}
            className="bg-food-yellow hover:bg-food-yellow/90 text-black font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 border-2 border-food-yellow hover:border-food-yellow/70 font-poppins"
          >
            <Camera className="w-6 h-6 mx-auto mb-2" />
            Tomar Foto
          </button>
          
          {/* Botón de Subir */}
          <button
            onClick={handleUploadClick}
            className="bg-olive-green hover:bg-olive-green/90 text-black font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 border-2 border-olive-green hover:border-olive-green/70 font-poppins"
          >
            <Upload className="w-6 h-6 mx-auto mb-2" />
            Subir Foto
          </button>
        </div>

        {/* Inputs ocultos */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="mt-8 text-sm text-gray-500 font-poppins flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            <p>Formatos soportados: JPG, PNG, WEBP</p>
          </div>
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            <p>Tamaño máximo: 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;