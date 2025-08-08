import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Interfaz del usuario que extraemos del token
export interface Usuario {
  idUsuario: number;
  username: string;
  correo: string;
  tipoUsuario: "INDIVIDUAL" | "EMPRESARIAL";
  rol: "ADMIN" | "DESARROLLADOR" | "LECTOR" | "EDITOR" | string;
  rolEquipo?: string;
  empresaId?: number;
  perfilCompleto: boolean;
  nombreEmpresa?: string;
}
interface RawToken {
  id: number;
  username?: string;
  correo?: string;
  tipoUsuario: "INDIVIDUAL" | "EMPRESARIAL";
  rol: string;
  rolEquipo?: string | null;
  empresaId?: number;
  perfilCompleto?: boolean;
  nombreEmpresa?: string;
  iat?: number;
  exp?: number;
}

// Tipo del contexto
interface UserContextType {
  usuario: Usuario | null;
  setUsuario: (user: Usuario | null) => void;
  cargando: boolean;
  refreshUsuario: () => void;
}

// Creamos el contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Proveedor de usuario
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true); // 🔄 Estado de carga inicial

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<RawToken>(token);

        // Adaptar el token al formato que espera la app
        const adapted: Usuario = {
          idUsuario: decoded.id,
          username: decoded.username ?? "",
          correo: decoded.correo ?? "",
          tipoUsuario: decoded.tipoUsuario,
          rol: decoded.rol,
          rolEquipo: decoded.rolEquipo ?? undefined,
          empresaId: decoded.empresaId,
          perfilCompleto: decoded.perfilCompleto ?? false,
          nombreEmpresa: decoded.nombreEmpresa ?? undefined,
        };

        setUsuario(adapted);
      } catch (e) {
        console.error("❌ Error al decodificar token:", e);
      }
    }
    setCargando(false);
  }, []);

  // Función para refrescar manualmente el usuario desde el token
  const refreshUsuario = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<Usuario>(token);
        setUsuario(decoded);
      } catch (e) {
        console.error("❌ Error al refrescar token:", e);
      }
    }
  };

  return (
    <UserContext.Provider value={{ usuario, setUsuario, cargando, refreshUsuario }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
/* eslint-disable react-refresh/only-export-components */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};