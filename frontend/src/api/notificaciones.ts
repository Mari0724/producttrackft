import axiosInstance from "../utils/axiosInstance";

// 🟢 GETs
export async function getNotificacionesUsuario(idUsuario: number) {
  const response = await axiosInstance.get(`/notificaciones/usuario/${idUsuario}`);
  return response.data;
}

export async function getProductosDelUsuario(idUsuario: number) {
  const response = await axiosInstance.get(`/productos/nombres/${idUsuario}`);
  return response.data;
}

export const getPreferenciasUsuario = async (idUsuario: number) => {
  const response = await axiosInstance.get(`/preferencias-notificaciones/${idUsuario}`);
  return response.data;
};

// 🟠 PATCHs
export async function marcarNotificacionLeida(idNotificacion: number) {
  const response = await axiosInstance.patch(`/notificaciones/${idNotificacion}`);
  return response.data;
}

export const actualizarPreferenciasUsuario = async (
  idUsuario: number,
  preferencias: {
    stockBajo?: boolean;
    productoVencido?: boolean;
    comentarios?: boolean;
    reposicion?: boolean;
    actualizacion?: boolean;
  }
) => {
  const { data } = await axiosInstance.patch(
    `/notificaciones/preferencias/${idUsuario}`,
    preferencias
  );
  return data;
};

// 🔵 POSTs
export const enviarNotificacionActualizacion = (data: {
  titulo: string;
  mensaje: string;
}) => {
  return axiosInstance.post('/notificaciones/actualizacion-app', data);
};

export const enviarNotificacionReposicion = (data: {
  tipo: string;
  titulo: string;
  mensaje: string;
  idUsuario: number;
}) => {
  return axiosInstance.post("/notificaciones", data);
};