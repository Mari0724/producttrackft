import axiosInstance from "../utils/axiosInstance";
import type { HistorialDTO } from "../types/Historial";
import type { InventoryChange } from "../types/Inventory";

export async function getHistorialInventario(idUsuario: number): Promise<InventoryChange[]> {
  const response = await axiosInstance.get(`/historial/usuario/${idUsuario}`);
  
  return response.data.map((h: HistorialDTO) => ({
    id: h.id.toString(),
    productName: h.nombreProducto,
    action:
      h.accion === "agregado"
        ? "added"
        : h.accion === "modificado"
        ? "modified"
        : "deleted",
    previousQuantity: h.cantidad_anterior,
    newQuantity: h.cantidad_nueva,
    previousPrice: h.precio_anterior,
    newPrice: h.precio_nuevo,
    changeDate: new Date(h.fechaCambio),
  }));
}