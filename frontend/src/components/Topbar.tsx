import { useState } from "react";
import { MdHelp, MdAccountCircle } from "react-icons/md";
import { ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import NotificationBell from "../components/producttrack/NotificationBell";

const Topbar = () => {
  const [menuActive, setMenuActive] = useState<{ help: boolean; profile: boolean }>({
    help: false,
    profile: false,
  });

  const { usuario, setUsuario } = useUser();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    navigate("/login");
  };

  const irAGestionEquipo = () => {
    navigate("/app/empresarial/equipo");
  };

  return (
    <header className="topbar flex items-center justify-between px-4 py-3 bg-white shadow gap-3">
      {/* Input responsivo */}
      <input
        type="text"
        placeholder="Buscar"
        className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#81203D] text-sm"
        style={{
          width: "clamp(100px, 30vw, 300px)",
        }}
      />

      {/* Botón y acciones agrupadas */}
      <div className="flex items-center gap-3">
        {/* Gestión de equipo para empresarial */}
        {usuario?.tipoUsuario === "EMPRESARIAL" && usuario?.rol !== "EQUIPO" && (
          <button
            onClick={irAGestionEquipo}
            className="flex items-center bg-[#808000] text-white px-2 md:px-4 py-1.5 rounded-lg hover:bg-[#6b6b00] transition-colors text-sm"
          >
            <Users className="w-4 h-4" />
            <span className="hidden md:inline ml-2">Gestión de Equipo</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        )}

        {/* Notificaciones (tu componente) */}
        <NotificationBell />

        {/* Ayuda */}
        <div className="relative">
          <div
            className="cursor-pointer"
            onClick={() => setMenuActive(menu => ({ ...menu, help: !menu.help, profile: false }))}
          >
            <MdHelp className="text-xl md:text-2xl" />
          </div>

          {menuActive.help && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 shadow-md rounded-lg p-4 z-10 text-sm">
              <p className="mb-2 font-semibold text-gray-800">¿Necesitas ayuda?</p>
              <p className="mb-1 text-gray-700">
                Para dudas, quejas y/o sugerencias por favor comuníquese a:
              </p>
              <p className="mb-1 font-medium text-[#800020]">producttrack5@gmail.com</p>
              <p className="mb-2 text-gray-700">
                En el asunto, indique claramente el motivo de su mensaje para facilitar la atención.
              </p>
              <p className="text-gray-600 text-xs italic">
                Tiempo de Respuesta: dentro de 30 días calendario. Para solicitudes complejas, hasta 60 días con notificación previa.
              </p>
            </div>
          )}
        </div>

        {/* Menú Perfil */}
        <div className="relative">
          <div
            className="cursor-pointer"
            onClick={() => setMenuActive(menu => ({ ...menu, profile: !menu.profile, help: false }))}
          >
            <MdAccountCircle className="text-2xl md:text-3xl" />
          </div>

          {menuActive.profile && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded-lg p-2 z-10">
              <button
                onClick={() => navigate("/perfil")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Mi perfil
              </button>
              <button
                onClick={cerrarSesion}
                className="w-full text-left block px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;