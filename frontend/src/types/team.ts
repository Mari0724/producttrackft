export type UserRole = 'LECTOR' | 'COMENTARISTA' | 'EDITOR';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  perfilCompleto?: boolean;
  estado: "activo" | "inactivo";
}

export interface TeamStats {
  total: number;
  byRole: {
    lector: number;
    comentarista: number;
    editor: number;
  };
}