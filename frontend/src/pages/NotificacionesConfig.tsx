import { useEffect, useState, useMemo } from "react";
import { Bell, Settings, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { actualizarPreferenciasUsuario, getPreferenciasUsuario } from "../api/notificaciones";

const opcionesNotificacion = [
  { id: "stockBajo", nombre: "Stock bajo" },
  { id: "productoVencido", nombre: "Producto vencido" },
  { id: "comentarios", nombre: "Comentarios de productos" },
  { id: "reposicion", nombre: "Recomendación de reposición" },
  { id: "actualizacion", nombre: "Actualización de la app" },
];

const NotificacionesConfig = () => {
  const [preferencias, setPreferencias] = useState<{ [key: string]: boolean } | null>(null);

  const usuarioId = useMemo(() => {
    const data = localStorage.getItem("idUsuario");
    return data ? parseInt(data) : null;
  }, []);

  useEffect(() => {
    const fetchPreferencias = async () => {
      if (!usuarioId) return;

      try {
        const prefs = await getPreferenciasUsuario(usuarioId);
        setPreferencias(prefs);
      } catch (error) {
        console.error("Error obteniendo preferencias del backend:", error);
      }
    };

    fetchPreferencias();
  }, [usuarioId]);

  const handleToggle = async (id: string) => {

    if (!preferencias || !usuarioId) return;

    const nuevas = { ...preferencias, [id]: !preferencias[id] };
    setPreferencias(nuevas);
    localStorage.setItem("preferenciasNotificaciones", JSON.stringify(nuevas));

    try {
      await actualizarPreferenciasUsuario(usuarioId, nuevas);
      toast.success("Preferencias actualizadas ✨", {
        style: {
          background: "#ffffff",
          color: "#166534",
          border: "1px solid #22c55e",
          fontWeight: "bold",
        },
      });
    } catch (error) {
      toast.error("Error actualizando preferencias.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-amber-50 to-yellow-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-rose-100/50">
        <div className="bg-gradient-to-r from-rose-700 to-yellow-500 text-white px-8 py-6 flex items-center gap-4">
          <Settings className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Configuración</h1>
        </div>

        <div className="p-8 space-y-6">
          <p className="text-gray-700 text-lg">
            Aquí puedes elegir qué tipos de notificaciones deseas recibir. Puedes cambiarlas en cualquier momento.
          </p>

          <div className="space-y-4">
            {opcionesNotificacion.map((op) => (
              <div
                key={op.id}
                className="flex items-center justify-between bg-white/60 hover:bg-white/90 border border-amber-100 p-4 rounded-xl shadow-sm transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Bell className="text-amber-600" />
                  <span className="font-medium text-gray-800">{op.nombre}</span>
                </div>

                {preferencias === null || typeof preferencias[op.id] === "undefined" ? (
                  <div className="w-11 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                ) : (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferencias[op.id]}
                      onChange={() => handleToggle(op.id)}
                      className="sr-only peer"
                    />
                    <div
                      className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-400
                             after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
                             after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                             peer-checked:after:translate-x-full peer-checked:after:border-white"
                    ></div>
                  </label>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-sm text-slate-500 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
            Las notificaciones desactivadas no serán enviadas. Esto solo aplica desde este navegador.
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificacionesConfig;