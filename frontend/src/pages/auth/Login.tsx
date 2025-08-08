import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LandingInfo from "../../components/team/LandingInfo";
import Footer from "../../components/team/Footer";
import { useUser } from "../../context/UserContext";
import { useToast } from '../../hooks/useToast';
import { url } from '../../constants';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUsuario } = useUser();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await response.json();

      // Guarda token y datos de usuario en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("tipoUsuario", data.user.tipoUsuario);
      localStorage.setItem("rol", data.user.rol);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("perfilCompleto", data.user.perfilCompleto ? "true" : "false");
      localStorage.setItem("rolEquipo", data.user.rolEquipo);

      // ID confiable del usuario
      const userId = data.user?.id ?? data.user?.idUsuario ?? data.usuario?.id;

      if (!userId) {
        throw new Error("No se pudo obtener el ID del usuario.");
      }

      localStorage.setItem("userId", userId.toString());
      localStorage.setItem("idUsuario", userId.toString());

      // Guarda el usuario en contexto
      setUsuario(data.user);

      // En este sistema, perfilCompleto = true significa que DEBE completar su perfil
      if (data.user.rol === "EQUIPO" && data.user.perfilCompleto) {
        navigate("/completar-perfil");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error("Correo o contraseña incorrecta. Por favor, verifica los datos e inténtalo nuevamente.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 md:p-8 overflow-auto">
        <div className="flex flex-col md:flex-row w-full max-w-[90%] md:max-w-4xl rounded-3xl overflow-hidden shadow-lg bg-white">
          <div className="md:w-2/5 bg-[#35492c] text-white p-8 flex flex-col justify-center items-center rounded-t-3xl md:rounded-l-2xl md:rounded-tr-none">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif mb-4 text-center break-words">
              ¡Bienvenido Nuevamente!
            </h2>
            <p className="text-center text-base md:text-lg mb-6 leading-snug">
              Para unirte por favor Inicia Sesión con tus datos
            </p>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2 bg-[#7a1d27] text-white rounded-full hover:bg-[#6a1722] transition"
            >
              Registrarse
            </button>
          </div>

          <div className="md:w-3/5 p-6 md:p-10 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-black mb-6 text-center">
              Iniciar sesión
            </h2>

            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-full px-12 py-2 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
                <FaEnvelope className="absolute left-4 top-3 text-gray-500" />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-full px-12 py-2 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
                <FaLock className="absolute left-4 top-3 text-gray-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="text-right text-sm text-[#35492c] hover:underline cursor-pointer">
                <span onClick={() => navigate("/recuperar-clave")}>
                  ¿Olvidaste tu contraseña?
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-600 text-white py-2 rounded-full hover:bg-yellow-700 transition"
              >
                Iniciar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
      <LandingInfo />
      <Footer />
    </>
  );
};

export default Login;