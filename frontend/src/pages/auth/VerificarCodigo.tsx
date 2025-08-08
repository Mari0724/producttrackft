import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { confirmarReset } from "../../services/authService";

const VerificarCodigo = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        symbol: false
    });

    const navigate = useNavigate();
    const { toast } = useToast();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        setPasswordValidation({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    }, [password]);

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    const isCodeComplete = code.every(digit => digit !== '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isCodeComplete) {
            toast.error("Por favor ingresa el código completo de 6 dígitos");
            return;
        }

        if (!isPasswordValid) {
            toast.error("La contraseña no cumple con los requisitos de seguridad");
            return;
        }

        setIsLoading(true);
        const codeString = code.join('');

        try {
            const data = await confirmarReset(codeString, password);
            toast.success(data.mensaje);
            navigate('/');
        } catch (error) {
            const axiosError = error as import("axios").AxiosError<{ mensaje?: string; message?: string }>;
            const mensajeError =
                axiosError.response?.data?.mensaje ||
                axiosError.response?.data?.message ||
                "El código ingresado no es válido o ha expirado";

            toast.error(mensajeError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-poppins flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-gris-claro p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-verde-oliva rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-vinotinto mb-2">
                            Verificar Código
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Ingresa el código de 6 dígitos y tu nueva contraseña
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Código de Verificación
                            </label>
                            <div className="flex justify-between gap-2">
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center text-lg font-semibold border border-gris-claro rounded-lg focus:outline-none focus:ring-2 focus:ring-vinotinto focus:border-vinotinto transition-colors"
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Nueva Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Ingresa tu nueva contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pr-10 pl-4 py-3 h-12 border border-gris-claro rounded-lg focus:outline-none focus:ring-2 focus:ring-vinotinto focus:border-vinotinto transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {password && (
                                <div className="mt-3 space-y-2">
                                    {[
                                        { key: 'length', text: 'Mínimo 8 caracteres' },
                                        { key: 'uppercase', text: 'Una letra mayúscula' },
                                        { key: 'lowercase', text: 'Una letra minúscula' },
                                        { key: 'number', text: 'Un número' },
                                        { key: 'symbol', text: 'Un símbolo especial' }
                                    ].map(({ key, text }) => (
                                        <div key={key} className="flex items-center text-xs">
                                            <CheckCircle
                                                className={`w-3 h-3 mr-2 ${passwordValidation[key as keyof typeof passwordValidation]
                                                        ? 'text-green-500'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                            <span className={
                                                passwordValidation[key as keyof typeof passwordValidation]
                                                    ? 'text-green-600'
                                                    : 'text-gray-500'
                                            }>
                                                {text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isCodeComplete || !isPasswordValid}
                            className="w-full h-12 bg-verde-oliva hover:bg-verde-oliva/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Restableciendo...
                                </div>
                            ) : (
                                'Restablecer Contraseña'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/recuperar-clave')}
                            className="inline-flex items-center text-sm text-vinotinto hover:text-verde-oliva/80 transition-colors duration-200"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Volver atrás
                        </button>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold text-vinotinto">ProductTrack</span> 
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerificarCodigo;