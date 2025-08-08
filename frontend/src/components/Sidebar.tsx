import { useEffect, useState } from "react";
import { FaHome, FaChartBar, FaBox, FaHistory, FaQrcode, FaCog, FaClipboardList, } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

const Sidebar = () => {
  const location = useLocation();
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    const storedRol = localStorage.getItem("rol");
    setTipoUsuario(tipo?.toLowerCase() ?? null);
    setRol(storedRol?.toUpperCase() ?? null);
  }, []);

  const basePath =
    tipoUsuario === "empresarial"
      ? "/app/empresarial"
      : tipoUsuario === "desarrollador"
      ? "/app/desarrollador"
      : "/app/individual";

  return (
    <div
      className={clsx(
        "group hover:w-60 w-20 bg-[#404D2C] text-white h-screen p-4 transition-all duration-300 ease-in-out relative"
      )}
    >
      <div className="flex flex-col gap-6 w-full mt-12">
        <div className="overflow-hidden transition-all duration-300">
          <h2 className="text-2xl font-bold mb-6 whitespace-nowrap hidden group-hover:block">
            Mi Inventario
          </h2>
        </div>

        <ul className="flex flex-col gap-6">
          <li>
            <Link
              to={`${basePath}/home`}
              className={clsx(
                "flex items-center gap-2 hover:text-[#FCDDEC] transition w-full",
                "justify-center group-hover:justify-start pl-0 group-hover:pl-2",
                location.pathname.includes("/home") && "font-semibold"
              )}
            >
              <FaHome className="text-2xl" />
              <span className="hidden group-hover:inline transition-all duration-300">
                Home
              </span>
            </Link>
          </li>

          <li>
            <Link
              to={`${basePath}/inventario`}
              className={clsx(
                "flex items-center gap-2 hover:text-[#FCDDEC] transition w-full",
                "justify-center group-hover:justify-start pl-0 group-hover:pl-2",
                location.pathname.includes("/inventario") && "font-semibold"
              )}
            >
              <FaBox className="text-2xl" />
              <span className="hidden group-hover:inline transition-all duration-300">
                Inventario
              </span>
            </Link>
          </li>

          {(rol === "DESARROLLADOR") && (
            <li>
              <Link
                to={`/app/desarrollador/reportes`}
                className={clsx(
                  "flex items-center gap-2 hover:text-[#FCDDEC] transition w-full",
                  "justify-center group-hover:justify-start pl-0 group-hover:pl-2",
                  location.pathname.includes("/reportes") && "font-semibold"
                )}
              >
                <FaChartBar className="text-2xl" />
                <span className="hidden group-hover:inline transition-all duration-300">
                  Reportes
                </span>
              </Link>
            </li>
          )}

          <li>
            <Link
              to={`${basePath}/historial`}
              className={clsx(
                "flex items-center gap-2 hover:text-[#FCDDEC] transition w-full",
                "justify-center group-hover:justify-start pl-0 group-hover:pl-2",
                location.pathname.includes("/historial") && "font-semibold"
              )}
            >
              <FaHistory className="text-2xl" />
              <span className="hidden group-hover:inline transition-all duration-300">
                Historial
              </span>
            </Link>
          </li>

          {tipoUsuario === "individual" && (
            <li>
              <Link
                to={`/nutriscan`}
                className={clsx(
                  "flex items-center gap-2 hover:text-[#FCDDEC] transition w-full",
                  "justify-center group-hover:justify-start pl-0 group-hover:pl-2",
                  location.pathname.includes("/nutriscan") && "font-semibold"
                )}
              >
                <FaQrcode className="text-2xl" />
                <span className="hidden group-hover:inline transition-all duration-300">
                  NutriScan
                </span>
              </Link>
            </li>
          )}

          {(rol === "ADMIN" || rol === "DESARROLLADOR") && (
            <li>
              <Link
                to={`/auditoria`}
                className={clsx(
                  "flex items-center gap-2 hover:text-[#FCDDEC] transition w-full",
                  "justify-center group-hover:justify-start pl-0 group-hover:pl-2",
                  location.pathname.includes("/auditoria") && "font-semibold"
                )}
              >
                <FaClipboardList className="text-2xl" />
                <span className="hidden group-hover:inline transition-all duration-300">
                  Auditoría
                </span>
              </Link>
            </li>
          )}

          <li>
            <Link
              to={`${basePath}/configuracion`}
              className={clsx(
                "flex items-center gap-2 hover:text-[#FCDDEC] transition w-full",
                "justify-center group-hover:justify-start pl-0 group-hover:pl-2",
                location.pathname.includes("/configuracion") && "font-semibold"
              )}
            >
              <FaCog className="text-2xl" />
              <span className="hidden group-hover:inline transition-all duration-300">
                Configuración
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;