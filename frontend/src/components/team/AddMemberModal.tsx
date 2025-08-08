import { useState } from "react";
import { X, User, Mail, Shield, Lock, Eye, EyeOff } from "lucide-react";
import type { TeamMember, UserRole } from "../../types/team";
import { useToast } from "../../hooks/useToast";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: Omit<TeamMember, "id"> & { password: string }) => void;
}

export const AddMemberModal = ({ isOpen, onClose, onAdd }: AddMemberModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "LECTOR" as UserRole,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else {
      const password = formData.password;
      if (password.length < 8) {
        newErrors.password = "Debe tener al menos 8 caracteres";
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = "Debe incluir al menos una mayúscula";
      } else if (!/[a-z]/.test(password)) {
        newErrors.password = "Debe incluir al menos una minúscula";
      } else if (!/[0-9]/.test(password)) {
        newErrors.password = "Debe incluir al menos un número";
      } else if (!/[^A-Za-z0-9]/.test(password)) {
        newErrors.password = "Debe incluir al menos un carácter especial";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onAdd({ ...formData, perfilCompleto: true, estado: "activo" });
      toast(`✅ ${formData.name} agregado al equipo exitosamente.`);
      setFormData({ name: "", email: "", password: "", role: "LECTOR" });
      setErrors({});
    } catch (error: unknown) {
      console.error(error);
      toast("❌ No se pudo agregar el miembro. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Agregar Nuevo Miembro</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-producttrack-olive/20 focus:border-producttrack-olive transition-colors ${errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                placeholder="Ej: Ana García López"
              />
            </div>
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-producttrack-olive/20 focus:border-producttrack-olive transition-colors ${errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                placeholder="ana.garcia@ejemplo.com"
              />
            </div>
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-producttrack-olive/20 focus:border-producttrack-olive transition-colors ${errors.password ? "border-red-300" : "border-gray-300"
                  }`}
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>
          
          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rol asignado</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, role: e.target.value as UserRole }))
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-producttrack-olive/20 focus:border-producttrack-olive transition-colors"
              >
                <option value="LECTOR">Lector - Solo puede ver contenido</option>
                <option value="COMENTARISTA">Comentarista - Puede ver y comentar</option>
                <option value="EDITOR">Editor - Puede ver, comentar y editar</option>
              </select>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 producttrack-button-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Agregando..." : "Agregar Miembro"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};