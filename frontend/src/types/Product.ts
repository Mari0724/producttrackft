export type EstadoProducto = 'DISPONIBLE' | 'AGOTADO' | 'RESERVADO' | 'VENCIDO';

export interface Product {
  id?: number;
  codigoBarras: string | null;
  codigoQR: string | null;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  fechaAdquisicion: string;
  fechaVencimiento: string;
  estado: EstadoProducto;
  imagen: string;
  categoria?: string;
  usuarioId: number;
  usuario?: {
    idUsuario: number;
    tipoUsuario: "INDIVIDUAL" | "EMPRESARIAL";
    empresaId?: number;
  };
}