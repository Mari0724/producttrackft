import { useState, useEffect } from "react";
import { X, User, Mail, Shield } from "lucide-react";
import type { TeamMember, UserRole } from "../../types/team";
import { useToast } from "../../hooks/useToast";

interface EditMemberModalProps {
    isOpen: boolean;
    member: TeamMember | null;
    onClose: () => void;
    onEdit: (member: Omit<TeamMember, "id">) => void;
}

export const EditMemberModal = ({ isOpen, member, onClose, onEdit }: EditMemberModalProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "LECTOR" as UserRole
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (member) {
            setFormData({
                name: member.name,
                email: member.email,
                role: member.role
            });
        }
    }, [member]);

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            onEdit({
                ...formData,
                estado: member!.estado,
            });
            toast(`✅ ${formData.name} actualizado correctamente.`);
            setErrors({});
        } catch (error) {
            console.log(error)
            toast("❌ No se pudo actualizar el miembro.");
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

    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Editar Miembro</h2>
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

                    {/* Rol */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rol asignado</label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={formData.role}
                                onChange={(e) =>
                                    setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))
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
                            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};