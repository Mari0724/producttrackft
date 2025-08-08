// types/UserProfile.ts
export interface UserProfile {
  type: 'INDIVIDUAL' | 'EMPRESARIAL' | 'EQUIPO';
  username: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  companyName?: string;
  nit?: string;
  role?: string;
  fotoPerfil?: string;
}