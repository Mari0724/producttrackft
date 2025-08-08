import { useEffect, useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { Edit, Save, User, Building2 } from 'lucide-react';
import PersonalInfo from '../../components/team/PersonalInfo';
import SecuritySettings from '../../components/team/SecuritySettings';
import { getUserProfile, updateUserProfile, uploadUserProfilePhoto } from '../../services/profileService';
import { getEmpresaInfo } from '../../services/profileService';
import { changeUserPassword } from '../../services/securityService';
import type { AxiosErrorResponse } from "../../types/AxiosError";
import type { UserDTO } from "../../types/UserDTO";

interface UserProfile {
  type: 'INDIVIDUAL' | 'EMPRESARIAL' | 'EQUIPO';
  username: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  companyName?: string;
  nit?: string;
  role?: string;
  fotoPerfil?: string;
  empresaId?: number;

}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'perfil' | 'seguridad'>('perfil');
  const [photo, setPhoto] = useState<File | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idUsuarioString = localStorage.getItem("idUsuario");

        if (!idUsuarioString || isNaN(Number(idUsuarioString))) {
          toast.error("ID de usuario inválido o no encontrado");
          return;
        }

        const idUsuario = Number(idUsuarioString);

        const data = await getUserProfile(idUsuario); // ✅ ahora sí se puede usar

        const userProfileData: UserProfile = {
          type: data.rol === 'EQUIPO' ? 'EQUIPO' : (data.tipoUsuario ?? 'INDIVIDUAL'),
          username: data.username,
          name: data.nombreCompleto,
          email: data.correo,
          phone: data.telefono || '',
          address: data.direccion || '',
          companyName: data.nombreEmpresa ?? '',
          nit: data.nit ?? '',
          role: data.rolEquipo || data.rol,
          fotoPerfil: data.fotoPerfil || '',
          empresaId: data.empresaId
        };

        // Si es EQUIPO y tiene empresaId, trae info de empresa
        if (userProfileData.type === 'EQUIPO' && data.empresaId) {
          const empresa = await getEmpresaInfo(data.empresaId);
          userProfileData.companyName = empresa.nombreEmpresa || 'Sin nombre';
          userProfileData.nit = empresa.nit || 'Sin NIT';
        }

        setUserProfile(userProfileData);

      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        toast.error("Error al cargar el perfil");
      }
    };

    fetchData();
  }, [toast]);


  if (!userProfile) return <div className="text-center text-gray-500">Cargando perfil...</div>;

  const handleSaveProfile = async () => {
    const idUsuario = parseInt(localStorage.getItem("idUsuario") || "0");

    try {
      if (photo) {
        await uploadUserProfilePhoto(idUsuario, photo);
      }

      const dataToUpdate: Partial<UserDTO> = {
        username: userProfile.username,
        nombreCompleto: userProfile.name,
        correo: userProfile.email,
        telefono: userProfile.phone,
        direccion: userProfile.address,
      };

      // Solo si el usuario NO es de tipo EQUIPO, enviamos nombreEmpresa y nit
      if (userProfile.type !== 'EQUIPO') {
        dataToUpdate.nombreEmpresa = userProfile.companyName;
        dataToUpdate.nit = userProfile.nit;
      }

      await updateUserProfile(idUsuario, dataToUpdate);

      const updatedData = await getUserProfile(idUsuario);
      setUserProfile({
        type: updatedData.tipoUsuario ?? 'INDIVIDUAL',
        username: updatedData.username,
        name: updatedData.nombreCompleto,
        email: updatedData.correo,
        phone: updatedData.telefono || '',
        address: updatedData.direccion || '',
        companyName: updatedData.nombreEmpresa ?? '',
        nit: updatedData.nit ?? '',
        role: updatedData.rolEquipo || updatedData.rol,
        fotoPerfil: updatedData.fotoPerfil || ''
      });

      toast.success("Perfil actualizado correctamente ✅");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error("Error al actualizar el perfil ❌");
    }
  };

  const handlePasswordSubmit = async () => {
    const idUsuarioString = localStorage.getItem("idUsuario");

    if (!idUsuarioString || isNaN(Number(idUsuarioString))) {
      toast.error("ID de usuario inválido o no encontrado");
      return;
    }

    const idUsuario = Number(idUsuarioString);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las contraseñas no coinciden ❌");
      return;
    }

    try {
      await changeUserPassword(idUsuario, passwordData.currentPassword, passwordData.newPassword);
      toast.success("Contraseña cambiada correctamente ✅");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsPasswordDialogOpen(false);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as AxiosErrorResponse;
        if (
          axiosError.response &&
          axiosError.response.data &&
          typeof axiosError.response.data.message === "string"
        ) {
          toast.error(axiosError.response.data.message);
          return;
        }
      }
      toast.error("Error al cambiar la contraseña ❌");
    }
  };

  const isAdmin = userProfile.role === 'ADMIN';
  const isDev = userProfile.role === 'DESARROLLADOR';
  const isIndividual = userProfile.type === 'INDIVIDUAL' || isAdmin || isDev;
  const isEmpresa = userProfile.type === 'EMPRESARIAL' && !isIndividual;
  const isEquipo = userProfile.type === 'EQUIPO' && !isIndividual;

  return (
    <div className="px-4 sm:px-0 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-[#f5f5dc] rounded-full flex items-center justify-center">
            {isEmpresa ? (
              <Building2 className="h-8 w-8 text-[#667233]" />
            ) : (
              <User className="h-8 w-8 text-[#667233]" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#667233] font-nunito">
              {isEmpresa && 'Perfil de Empresa'}
              {isEquipo && 'Perfil de Equipo'}
              {isIndividual && 'Mi Perfil'}
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona tu información personal y configuración de cuenta
            </p>
          </div>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#667233] hover:bg-[#556322] text-white py-2 px-4 rounded mt-4 sm:mt-0 flex items-center"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar Perfil
          </button>
        ) : (
          <button
            onClick={handleSaveProfile}
            className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded mt-4 sm:mt-0 flex items-center"
          >
            <Save className="mr-2 h-4 w-4" />
            Guardar Cambios
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 flex gap-8">
        <button
          onClick={() => setActiveTab('perfil')}
          className={`py-2 font-semibold ${activeTab === 'perfil'
            ? 'text-[#667233] border-b-2 border-[#667233]'
            : 'text-gray-500'
            }`}
        >
          Información Personal
        </button>
        <button
          onClick={() => setActiveTab('seguridad')}
          className={`py-2 font-semibold ${activeTab === 'seguridad'
            ? 'text-[#667233] border-b-2 border-[#667233]'
            : 'text-gray-500'
            }`}
        >
          Seguridad
        </button>
      </div>

      {activeTab === 'perfil' && userProfile && (
        <PersonalInfo
          userProfile={userProfile}
          setUserProfile={setUserProfile as React.Dispatch<React.SetStateAction<UserProfile>>}

          isEditing={isEditing}
          isIndividual={isIndividual}
          isEmpresa={isEmpresa}
          isEquipo={isEquipo}
          photo={photo}
          setPhoto={setPhoto}
        />
      )}

      {activeTab === 'seguridad' && (
        <SecuritySettings
          passwordData={passwordData}
          setPasswordData={setPasswordData}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          isPasswordDialogOpen={isPasswordDialogOpen}
          setIsPasswordDialogOpen={setIsPasswordDialogOpen}
          handlePasswordSubmit={handlePasswordSubmit}
        />
      )}
    </div>
  );
};

export default Profile;