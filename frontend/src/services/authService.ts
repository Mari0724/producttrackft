import axiosInstance from '../utils/axiosInstance';

export const solicitarReset = async (correo: string) => {
  const response = await axiosInstance.post('/auth/solicitar-reset', { correo });
  return response.data;
};

export const confirmarReset = async (token: string, nuevaContrasena: string) => {
  const response = await axiosInstance.post('/auth/confirmar-reset', {
    token,
    nuevaContrasena,
  });
  return response.data;
};