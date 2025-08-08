import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LeftPanel from "../../components/team/LeftPanel";
import RegisterForm from "../../components/team/RegisterForm";
import LandingInfo from "../../components/team/LandingInfo";
import Footer from "../../components/team/Footer";
import { useToast } from "../../hooks/useToast";
import { url } from '../../constants';

interface RegistroUsuario {
  username: string;
  correo: string;
  password: string;
  nombreCompleto: string;
  telefono: string;
  direccion: string;
  rol: string;
  tipoUsuario: "INDIVIDUAL" | "EMPRESARIAL";
  nombreEmpresa?: string;
  nit?: string;
}

const Register: React.FC = () => {
  const [userType, setUserType] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [nit, setNit] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [acceptPolicies, setAcceptPolicies] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!userType) newErrors.userType = "Selecciona un tipo de usuario.";
    if (!username.trim()) newErrors.username = "El nombre de usuario es obligatorio.";
    if (!email.includes("@")) newErrors.email = "Correo inválido.";
    if (password.length < 6) newErrors.password = "Mínimo 6 caracteres.";
    if (!fullName.trim()) newErrors.fullName = "Nombre completo obligatorio.";
    if (!/^[0-9]{7,15}$/.test(phone)) newErrors.phone = "Teléfono inválido.";
    if (!address.trim()) newErrors.address = "Dirección obligatoria.";
    if (userType === "empresarial") {
      if (!companyName.trim()) newErrors.companyName = "Nombre de empresa requerido.";
      if (!nit.trim()) newErrors.nit = "NIT obligatorio.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!acceptPolicies) {
      toast.error("Debes aceptar los términos y la política de privacidad.");
      return;
    }

    const datos: RegistroUsuario = {
      username,
      correo: email,
      password,
      nombreCompleto: fullName,
      telefono: phone,
      direccion: address,
      rol: "USUARIO",
      tipoUsuario: userType.toUpperCase() as "INDIVIDUAL" | "EMPRESARIAL",
      ...(userType === "empresarial" && {
        nombreEmpresa: companyName,
        nit,
      }),
    };

    try {
      setLoading(true);
      await axios.post(`${url}/usuarios`, datos);
      toast.success("Usuario registrado correctamente 🎉");
      navigate("/login");
    } catch (error: unknown) {
      const mensaje =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "No se pudo registrar el usuario.";
      console.error("❌ Error al registrar usuario:", mensaje);
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 md:p-8 overflow-auto">
        <div className="flex flex-col md:flex-row w-full max-w-[90%] md:max-w-4xl h-auto rounded-3xl overflow-hidden shadow-lg bg-white">
          <LeftPanel onLogin={() => navigate("/login")} />
          <RegisterForm
            userType={userType}
            username={username}
            email={email}
            password={password}
            fullName={fullName}
            phone={phone}
            address={address}
            companyName={companyName}
            nit={nit}
            errors={errors}
            loading={loading}
            onSubmit={handleRegister}
            setUserType={setUserType}
            setUsername={setUsername}
            setEmail={setEmail}
            setPassword={setPassword}
            setFullName={setFullName}
            setPhone={setPhone}
            setAddress={setAddress}
            setCompanyName={setCompanyName}
            setNit={setNit}
            acceptPolicies={acceptPolicies}
            setAcceptPolicies={setAcceptPolicies}
          />
        </div>
      </div>
      <LandingInfo />
      <Footer />
    </>
  );
};

export default Register;