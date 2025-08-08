import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { UserProvider, useUser } from "./context/UserContext";

// Layout
import Layout from "./layout/Layout";

// Páginas públicas
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import RecuperarClave from "./pages/auth/RecuperarClave";
import VerificarCodigo from "./pages/auth/VerificarCodigo";

// Páginas privadas
import Index from "./router/Index";
import NotificacionesConfig from "./pages/NotificacionesConfig";

// INDIVIDUAL
import InventarioIndividual from "./pages/individual/Inventario";
import HistorialIndividual from "./pages/individual/Historial";

// EMPRESARIAL
import InventarioEmpresarial from "./pages/empresarial/Inventario";
import HistorialEmpresarial from "./pages/empresarial/Historial";
import TeamManagement from "./pages/equipo/TeamManagement";

// DESARROLLADOR
import ReportesDesarrollador from "./pages/desarrollador/Reportes";

// Auditoría
import AuditoriaIndex from "./pages/AuditoriaIndex";
import NutriScanAuditoria from "./pages/nutriscan/NutriScanAuditoria";
import EquipoAuditoria from "./pages/equipo/EquipoAuditoria";
import UsuarioAuditoria from "./pages/equipo/UsuarioAuditoria";

// Otros
import NutriScan from "./pages/nutriscan/NutriScan";
import Profile from "./pages/perfil/Profile";
import CompleteProfile from "./pages/perfil/CompletaProfile";

// 🔐 Redirección raíz
function RutaRaiz() {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/home" replace /> : <Navigate to="/register" replace />;
}

// 🧱 Wrapper para pasar props al layout
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { usuario } = useUser();
  if (!usuario) return null;

  return (
    <Layout userType={usuario.tipoUsuario} companyName={usuario.nombreEmpresa}>
      {children}
    </Layout>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<RutaRaiz />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terminos-y-condiciones" element={<TermsOfService />} />
          <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
          <Route path="/recuperar-clave" element={<RecuperarClave />} />
          <Route path="/verificar-codigo" element={<VerificarCodigo />} />
          <Route path="/completar-perfil" element={<CompleteProfile />} />

          {/* Privadas - Rutas individuales con LayoutWrapper */}
          <Route path="/home" element={<LayoutWrapper><Index /></LayoutWrapper>} />
          <Route path="/nutriscan" element={<LayoutWrapper><NutriScan /></LayoutWrapper>} />
          <Route path="/perfil" element={<LayoutWrapper><Profile /></LayoutWrapper>} />

          {/* INDIVIDUAL */}
          <Route path="/app/individual/home" element={<LayoutWrapper><Index /></LayoutWrapper>} />
          <Route path="/app/individual/inventario" element={<LayoutWrapper><InventarioIndividual /></LayoutWrapper>} />
          <Route path="/app/individual/historial" element={<LayoutWrapper><HistorialIndividual /></LayoutWrapper>} />
          <Route path="/app/individual/configuracion" element={<LayoutWrapper><NotificacionesConfig /></LayoutWrapper>} />

          {/* EMPRESARIAL */}
          <Route path="/app/empresarial/home" element={<LayoutWrapper><Index /></LayoutWrapper>} />
          <Route path="/app/empresarial/inventario" element={<LayoutWrapper><InventarioEmpresarial /></LayoutWrapper>} />
          <Route path="/app/empresarial/historial" element={<LayoutWrapper><HistorialEmpresarial /></LayoutWrapper>} />
          <Route path="/app/empresarial/configuracion" element={<LayoutWrapper><NotificacionesConfig /></LayoutWrapper>} />
          <Route path="/app/empresarial/equipo" element={<LayoutWrapper><TeamManagement /></LayoutWrapper>} />

          {/* DESARROLLADOR */}
          <Route path="/app/desarrollador/home" element={<LayoutWrapper><Index /></LayoutWrapper>} />
          <Route path="/app/desarrollador/reportes" element={<LayoutWrapper><ReportesDesarrollador /></LayoutWrapper>} />
          <Route path="/app/desarrollador/configuracion" element={<LayoutWrapper><NotificacionesConfig /></LayoutWrapper>} />

          {/* AUDITORÍA */}
          <Route path="/auditoria" element={<LayoutWrapper><AuditoriaIndex /></LayoutWrapper>} />
          <Route path="/auditoria/nutriscan" element={<LayoutWrapper><NutriScanAuditoria /></LayoutWrapper>} />
          <Route path="/auditoria/equipo" element={<LayoutWrapper><EquipoAuditoria /></LayoutWrapper>} />
          <Route path="/auditoria/usuarios" element={<LayoutWrapper><UsuarioAuditoria /></LayoutWrapper>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <Toaster richColors position="top-right" />
      </Router>
    </UserProvider>
  );
}

export default App;