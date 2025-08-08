import axios from "../utils/axiosInstance";
import type { UserDTO } from "../types/UserDTO";

// Obtener empresa por ID
export const getEmpresaById = async (id: number) => {
  const response = await axios.get<UserDTO>(`/usuarios/empresa/${id}`);
  return response.data;
};

// Obtener usuario por ID
export const getUserById = async (id: number) => {
  const response = await axios.get<UserDTO>(`/usuarios/${id}`);
  return response.data;
};

// Actualizar usuario
export const updateUsuario = async (id: number, data: Partial<UserDTO>) => {
  const response = await axios.put<{ message: string }>(`/usuarios/${id}`, data);
  return response.data;
};


//subir foto de perfil con cloudinary
export const subirFotoPerfil = async (userId: number, foto: File) => {
  const formData = new FormData();
  formData.append("fotoPerfil", foto);

  const response = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/usuarios/${userId}/foto`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return response.data;
};