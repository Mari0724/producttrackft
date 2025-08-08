import axios from 'axios';
import { url } from '../constants';

export const getComentariosPorProducto = (productoId: number) => {
  return axios.get(`${url}/comentarios/${productoId}`);
};

export const crearComentario = (comentario: { idUsuario: number, idProducto: number, comentario: string }) => {
  return axios.post(`${url}/comentarios`, comentario);
};