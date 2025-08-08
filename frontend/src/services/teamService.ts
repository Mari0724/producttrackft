import axiosInstance from "../utils/axiosInstance";

export interface CreateTeamMemberDTO {
  username: string;
  correo: string;
  password: string;
  nombreCompleto: string;
  rolEquipo: "LECTOR" | "COMENTARISTA" | "EDITOR";
  telefono: string;
  direccion: string;
  fotoPerfil?: string;
  estado?: "activo" | "inactivo";
  empresaId?: number;
  perfilCompleto?: boolean;
}

export interface UpdateTeamMemberDTO {
  nombreCompleto?: string;
  correo?: string;
  rolEquipo?: "LECTOR" | "COMENTARISTA" | "EDITOR";
  telefono?: string;
  direccion?: string;
  fotoPerfil?: string;
  estado?: "activo" | "inactivo";
}

export async function createTeamMember(data: CreateTeamMemberDTO) {
  const response = await axiosInstance.post("/equipo", data);
  return response.data;
}

export const getAllTeamMembers = async () => {

  const token = localStorage.getItem("token");
  console.log("🔑 Token desde service:", token);
  const response = await axiosInstance.get("/equipo");
  return response.data;
};

export const updateTeamMember = async (
  id: number,
  data: UpdateTeamMemberDTO
) => {
  const response = await axiosInstance.put(`/equipo/${id}`, data);
  return response.data;
};

export const deleteTeamMember = async (id: number) => {
  const response = await axiosInstance.delete(`/equipo/eliminar-logico/${id}`);
  return response.data;
};