import type { Product } from '../types/Product';
import axiosInstance from '../utils/axiosInstance';

// ✅ Productos
export const getProductos = () =>
  axiosInstance.get<Product[]>('/productos');

export const crearProducto = (data: Product) =>
  axiosInstance.post<Product>('/productos', data);

export const editarProducto = (id: number, data: Partial<Product>) =>
  axiosInstance.put(`/productos/${id}`, data);

export const eliminarProducto = (id: number) =>
  axiosInstance.delete(`/productos/${id}`);

// ✅ Categorías
export const getCategorias = (tipoUsuario: string) =>
  axiosInstance.get<string[]>(`/productos/categorias?tipoUsuario=${tipoUsuario}`);

export const getProductosPorCategoria = (categoria: string) =>
  axiosInstance.get<Product[]>(`/productos/por-categoria?categoria=${encodeURIComponent(categoria)}`);

export const getProductoPorId = (id: number) =>
  axiosInstance.get<Product>(`/productos/${id}`);