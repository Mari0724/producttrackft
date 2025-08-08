import axiosInstance from "../utils/axiosInstance";

export async function getPreferenciasNotificaciones(idUsuario: number) {
  const response = await axiosInstance.get(`/preferencias-notificaciones/${idUsuario}`);
  return response.data;
}

export async function updatePreferenciasNotificaciones(
  idUsuario: number,
  preferencias: {
    stockBajo?: boolean;
    productoVencido?: boolean;
    comentarios?: boolean;
    reposicion?: boolean;
    actualizacion?: boolean;
  }
) {
  const response = await axiosInstance.put(`/preferencias-notificaciones/${idUsuario}`, preferencias);
  return response.data;
}