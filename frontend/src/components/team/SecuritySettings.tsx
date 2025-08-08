import React from "react";
import { Lock, Shield, Eye, EyeOff } from "lucide-react";

interface Props {
    passwordData: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    };
    setPasswordData: React.Dispatch<React.SetStateAction<{
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }>>;
    showPassword: {
        current: boolean;
        new: boolean;
        confirm: boolean;
    };
    setShowPassword: React.Dispatch<React.SetStateAction<{
        current: boolean;
        new: boolean;
        confirm: boolean;
    }>>;
    isPasswordDialogOpen: boolean;
    setIsPasswordDialogOpen: (open: boolean) => void;
    handlePasswordSubmit: () => void;
}

const SecuritySettings: React.FC<Props> = ({
    passwordData,
    setPasswordData,
    showPassword,
    setShowPassword,
    isPasswordDialogOpen,
    setIsPasswordDialogOpen,
    handlePasswordSubmit,
}) => {
    return (
        <div className="bg-white shadow rounded p-6">
            <h2 className="text-[#667233] text-xl font-semibold mb-4">Configuración de Seguridad</h2>

            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium">Contraseña</p>
                <button
                    onClick={() => setIsPasswordDialogOpen(true)}
                    className="flex items-center text-[#667233] border border-[#667233] px-4 py-2 rounded hover:bg-[#f6f6e3]"
                >
                    <Lock className="mr-2 h-4 w-4" />
                    Cambiar Contraseña
                </button>
            </div>

            <div className="bg-[#fefce8] p-4 rounded text-sm text-gray-700">
                <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-[#667233] mt-1" />
                    <div>
                        <p className="font-medium text-[#667233]">Consejos de Seguridad</p>
                        <ul className="mt-2 list-disc pl-5 space-y-1">
                            <li>Usa una contraseña fuerte con al menos 8 caracteres</li>
                            <li>Incluye letras mayúsculas, minúsculas, números y símbolos</li>
                            <li>No compartas tu contraseña con nadie</li>
                            <li>Cambia tu contraseña regularmente</li>
                        </ul>
                    </div>
                </div>
            </div>

            {isPasswordDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold text-[#667233] mb-2">Cambiar Contraseña</h2>
                        <p className="text-sm text-gray-600 mb-4">Ingresa tu contraseña actual y la nueva contraseña.</p>

                        <div className="mb-3 relative">
                            <label className="block text-sm font-medium mb-1">Contraseña actual</label>
                            <input
                                type={showPassword.current ? "text" : "password"}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className="w-full border rounded px-3 py-2 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                                className="absolute right-3 top-9 text-gray-500"
                            >
                                {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="mb-3 relative">
                            <label className="block text-sm font-medium mb-1">Nueva contraseña</label>
                            <input
                                type={showPassword.new ? "text" : "password"}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="w-full border rounded px-3 py-2 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                className="absolute right-3 top-9 text-gray-500"
                            >
                                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="mb-4 relative">
                            <label className="block text-sm font-medium mb-1">Confirmar nueva contraseña</label>
                            <input
                                type={showPassword.confirm ? "text" : "password"}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="w-full border rounded px-3 py-2 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                                className="absolute right-3 top-9 text-gray-500"
                            >
                                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setIsPasswordDialogOpen(false)}
                                className="px-4 py-2 rounded border w-full mr-2"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handlePasswordSubmit}
                                className="px-4 py-2 bg-[#667233] text-white rounded w-full ml-2"
                            >
                                Cambiar Contraseña
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecuritySettings;