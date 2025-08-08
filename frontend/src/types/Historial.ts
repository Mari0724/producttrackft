export interface HistorialDTO {
id: number;
nombreProducto: string;
accion: 'agregado' | 'modificado' | 'eliminado';
cantidad_anterior: number;
cantidad_nueva: number;
precio_anterior: number;
precio_nuevo: number;
fechaCambio: string;
}