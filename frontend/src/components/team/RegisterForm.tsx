import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaHome, FaBuilding, FaIdCard, } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  userType: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
  companyName: string;
  nit: string;
  errors: { [key: string]: string };
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  setUserType: React.Dispatch<React.SetStateAction<string>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setCompanyName: React.Dispatch<React.SetStateAction<string>>;
  setNit: React.Dispatch<React.SetStateAction<string>>;
  acceptPolicies: boolean;
  setAcceptPolicies: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterForm: React.FC<Props> = ({
  userType,
  username,
  email,
  password,
  fullName,
  phone,
  address,
  companyName,
  nit,
  errors,
  loading,
  onSubmit,
  setUserType,
  setUsername,
  setEmail,
  setPassword,
  setFullName,
  setPhone,
  setAddress,
  setCompanyName,
  setNit,
  acceptPolicies,
  setAcceptPolicies,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const renderError = (field: string) =>
    errors[field] && <p className="text-red-600 text-sm mt-1 ml-3">{errors[field]}</p>;

  return (
    <div className="md:w-3/5 p-6 md:p-10 flex flex-col justify-center">
      <h2 className="text-2xl md:text-3xl font-semibold text-black mb-6 text-center">
        Crear una cuenta
      </h2>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        {/* Select Tipo Usuario */}
        <div className="relative">
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-12 py-2 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700 appearance-none"
          >
            <option value="">Selecciona un tipo de usuario</option>
            <option value="individual">Individual</option>
            <option value="empresarial">Empresarial</option>
          </select>
          <FaUser className="absolute left-4 top-3 text-gray-500" />
          {renderError("userType")}
        </div>

        {/* Nombre de Usuario */}
        <div className="relative">
          <input
            type="text"
            placeholder="Nombre de Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-12 py-2 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700"
          />
          <FaUser className="absolute left-4 top-3 text-gray-500" />
          {renderError("username")}
        </div>

        {/* Correo Electrónico */}
        <div className="relative">
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-12 py-2 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700"
          />
          <FaEnvelope className="absolute left-4 top-3 text-gray-500" />
          {renderError("email")}
        </div>

        {/* Contraseña */}
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
            className="absolute right-4 top-2.5 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          {renderError("password")}
        </div>

        {/* Datos comunes */}
        {(userType === "individual" || userType === "empresarial") && (
          <>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre Completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-12 py-2"
              />
              <FaIdCard className="absolute left-4 top-3 text-gray-500" />
              {renderError("fullName")}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Número de Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-12 py-2"
              />
              <FaPhone className="absolute left-4 top-3 text-gray-500" />
              {renderError("phone")}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-12 py-2"
              />
              <FaHome className="absolute left-4 top-3 text-gray-500" />
              {renderError("address")}
            </div>
          </>
        )}

        {/* Datos empresariales */}
        {userType === "empresarial" && (
          <>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre de la Empresa"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-12 py-2"
              />
              <FaBuilding className="absolute left-4 top-3 text-gray-500" />
              {renderError("companyName")}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="NIT"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-12 py-2"
              />
              <FaIdCard className="absolute left-4 top-3 text-gray-500" />
              {renderError("nit")}
            </div>
          </>
        )}

        <div className="flex items-start gap-2 text-sm text-gray-700">
          <input
            id="acceptPolicies"
            type="checkbox"
            checked={acceptPolicies}
            onChange={(e) => setAcceptPolicies(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="acceptPolicies" className="leading-snug">
            He leído y acepto los{" "}
            <a href="/terminos-y-condiciones" className="text-blue-600 hover:underline" target="_blank">
              Términos y Condiciones
            </a>{" "}
            y la{" "}
            <a href="/politica-de-privacidad" className="text-blue-600 hover:underline" target="_blank">
              Política de Privacidad
            </a>
            .
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 text-white py-2 rounded-full transition text-sm md:text-base bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50"
        >
          {loading ? "Registrando..." : "Registrarme"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;