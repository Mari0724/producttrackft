import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import type { AxiosError } from "axios";
import { solicitarReset } from "../../services/authService";

const RecuperarClave = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Por favor ingresa tu correo electrónico");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Por favor ingresa un correo electrónico válido");
            return;
        }

        setIsLoading(true);

        try {
            const data = await solicitarReset(email);
            toast.success(data.mensaje);
            navigate('/verificar-codigo');
        } catch (error) {
            const axiosError = error as AxiosError<{ mensaje?: string; message?: string }>;
            const mensajeError =
                axiosError.response?.data?.mensaje ||
                axiosError.response?.data?.message ||
                "Ocurrió un error al solicitar el cambio de contraseña";

            toast.error(mensajeError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-poppins flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-gris-claro p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-verde-oliva rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-vinotinto mb-2">
                            Recuperar Contraseña
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Ingresa tu correo electrónico y te enviaremos un código de verificación
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 h-12 border border-gris-claro rounded-lg focus:outline-none focus:ring-2 focus:ring-vinotinto focus:border-vinotinto transition-colors"
                                />
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-verde-oliva hover:bg-verde-oliva/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Enviando...
                                </div>
                            ) : (
                                'Enviar Código'
                            )}
                        </button>
                    </form>

                    {/* Back to login link */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center text-sm text-vinotinto hover:text-verde-oliva/80 transition-colors duration-200"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Volver al inicio
                        </button>
                    </div>
                </div>

                {/* ProductTrack branding */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold text-vinotinto">ProductTrack</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RecuperarClave;