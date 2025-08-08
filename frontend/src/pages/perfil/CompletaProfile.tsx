import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, User, Building2, Mail, Phone, MapPin, Lock, Image as ImageIcon } from "lucide-react";
import { getEmpresaById, getUserById, updateUsuario, subirFotoPerfil } from "../../services/userService";
import { AxiosError } from "axios";
import type { UserDTO } from "../../types/UserDTO";
import { useUser } from "../../context/UserContext";
import { useToast } from "../../hooks/useToast";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { usuario } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    newPassword: "",
    confirmPassword: "",
    username: "",
    profilePhoto: null as File | null,
  });

  const [empresaNombre, setEmpresaNombre] = useState("Sin empresa");
  const [correoUsuario, setCorreoUsuario] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (usuario?.idUsuario) {
          const userData = await getUserById(usuario.idUsuario);
          setCorreoUsuario(userData.correo);

          if (userData.empresaId) {
            const empresaData = await getEmpresaById(Number(userData.empresaId));
            setEmpresaNombre(empresaData.nombreEmpresa || "Sin empresa");
          }
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarDatos();
  }, [usuario]);

  const handleInputChange = (field: keyof typeof formData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "username") setUsernameError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.newPassword) {
     toast.error("Debes ingresar una nueva contraseña."); setIsSubmitting(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      setIsSubmitting(false);
      return;
    }

    const dataToSend: Partial<UserDTO> & { password: string } = {
      password: formData.newPassword,
      perfilCompleto: false,
    };

    if (formData.username) dataToSend.username = formData.username;
    if (formData.phone) dataToSend.telefono = formData.phone;
    if (formData.address) dataToSend.direccion = formData.address;
    if (formData.profilePhoto) {
      const subida = await subirFotoPerfil(usuario?.idUsuario || 0, formData.profilePhoto);
      dataToSend.fotoPerfil = subida.url;
    }

    try {
      const response = await updateUsuario(usuario?.idUsuario || 0, dataToSend);
      toast.success(response.message);
      navigate("/");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg = err.response?.data?.message || "Error al actualizar.";
      if (errorMsg.includes("Unique constraint failed") || errorMsg.includes("ya está en uso")) {
        setUsernameError("Ese nombre de usuario ya está en uso.");
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-10 w-10 text-yellow-800" />
        </div>
        <h1 className="text-3xl font-bold text-[#800000]">¡Completa tu perfil!</h1>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          Para comenzar a usar ProductTrack, completa tu información personal.
        </p>
      </div>

      <div className="mb-6 p-4 border-l-4 border-yellow-500 bg-white shadow rounded">
        <h2 className="flex items-center text-yellow-800 font-semibold">
          <CheckCircle className="h-5 w-5 mr-2" /> Información ya registrada
        </h2>
        <ul className="mt-3 space-y-1 text-sm">
          <li className="flex items-center"><Mail className="h-4 w-4 mr-2 text-gray-500" /> <strong>Correo:</strong> {correoUsuario}</li>
          <li className="flex items-center"><Building2 className="h-4 w-4 mr-2 text-gray-500" /> <strong>Empresa:</strong> {empresaNombre}</li>
          <li className="flex items-center"><User className="h-4 w-4 mr-2 text-gray-500" /> <strong>Rol en equipo:</strong> {usuario?.rolEquipo}</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Foto de perfil</label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleInputChange("profilePhoto", e.target.files?.[0] || null)}
              className="pl-10 w-full border rounded px-3 py-2 file:bg-[#800000] file:text-white file:border-none file:rounded file:py-1 file:px-2 file:cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nombre de usuario</label>
          <input
            type="text"
            value={formData.username}
            placeholder="Ej: IUNI"
            onChange={(e) => handleInputChange("username", e.target.value)}
            className={`w-full border rounded px-3 py-2 ${usernameError ? "border-red-500" : ""}`}
          />
          {usernameError && <p className="text-sm text-red-600 mt-1">{usernameError}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              placeholder="Ej: +57 3001234567"
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="pl-10 w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={formData.address}
              placeholder="Ej: Calle 10 #20-30 Bogotá"
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="pl-10 w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 flex items-center">
            <Lock className="h-4 w-4 mr-2 text-gray-600" /> Nueva contraseña *
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              className="w-full border rounded px-3 py-2 pr-10"
              required
            />
            <button type="button" className="absolute right-3 top-2.5 text-gray-500" onClick={() => setShowNewPassword((prev) => !prev)}>
              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirmar contraseña</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="w-full border rounded px-3 py-2 pr-10"
            />
            <button type="button" className="absolute right-3 top-2.5 text-gray-500" onClick={() => setShowConfirmPassword((prev) => !prev)}>
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-[#800000] hover:bg-[#700000] text-white py-3 rounded">
          {isSubmitting ? "Guardando..." : "Completar Perfil"}
        </button>
      </form>

      <div className="mt-6 p-4 bg-yellow-100 rounded">
        <p className="text-sm text-gray-700">
          <strong>Nota:</strong> Los campos marcados con * son obligatorios. Una vez completes tu perfil, podrás acceder a todas las funcionalidades de ProductTrack según tu rol asignado.
        </p>
      </div>
    </div>
  );
};

export default CompleteProfile;