import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { TeamMember } from "../../types/team";
import { useToast } from "../../hooks/useToast";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    member: TeamMember | null;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteConfirmModal = ({
    isOpen,
    member,
    onClose,
    onConfirm,
}: DeleteConfirmModalProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();

    const handleConfirm = async () => {
        setIsDeleting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            onConfirm();

            toast(` ${member?.name} ha sido eliminado del equipo.`);
        } catch (error) {
            console.log(error)
            toast(" No se pudo eliminar el miembro. Inténtalo de nuevo.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Confirmar Eliminación</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">¿Eliminar a {member.name}?</h3>
                            <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                    </div>

                    <p className="text-gray-600 mb-6">
                        Esta acción no se puede deshacer. El miembro será eliminado permanentemente del equipo
                        y perderá acceso a todos los recursos del proyecto.
                    </p>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isDeleting}
                            className="flex-1 producttrack-button-danger disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? "Eliminando..." : "Eliminar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};