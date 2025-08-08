import { useNavigate } from "react-router-dom";
import { SearchCheck } from "lucide-react";

const AuditoriaIndex = () => {
  const navigate = useNavigate();

  const auditorias = [
    {
      titulo: "Usuarios",
      descripcion: "Auditoría de todos los usuarios registrados en el sistema",
      ruta: "/auditoria/usuarios",
    },
    {
      titulo: "Equipo",
      descripcion: "Auditoría sobre la gestión de miembros del equipo",
      ruta: "/auditoria/equipo",
    },
    {
      titulo: "NutriScan",
      descripcion: "Análisis nutricionales generados por los usuarios",
      ruta: "/auditoria/nutriscan",
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <SearchCheck className="text-wine-red w-8 h-8" />
        <h1 className="text-3xl font-bold text-wine-red">Panel de Auditoría</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {auditorias.map((audi) => (
          <div
            key={audi.ruta}
            onClick={() => navigate(audi.ruta)}
            className="border border-gray-300 rounded-lg p-6 shadow hover:shadow-lg cursor-pointer hover:bg-gray-50 transition-all"
          >
            <h2 className="text-xl font-semibold text-wine-red mb-2">{audi.titulo}</h2>
            <p className="text-gray-700 text-sm">{audi.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditoriaIndex;