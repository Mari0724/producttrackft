export interface UserDTO {
    idUsuario: number;
    username: string;
    correo: string;
    nombreCompleto: string;
    telefono?: string;
    direccion?: string;
    nombreEmpresa?: string;
    nit?: string;
    estado: string;
    rol: 'USUARIO' | 'EQUIPO' | 'ADMIN' | 'DESARROLLADOR';
    tipoUsuario?: "INDIVIDUAL" | "EMPRESARIAL";
    rolEquipo?: "LECTOR" | "COMENTARISTA" | "EDITOR";
    perfilCompleto?: boolean;
    empresaId?: number;
    fotoPerfil?: string;
}