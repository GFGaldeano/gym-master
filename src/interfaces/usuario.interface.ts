export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password_hash: string;
  rol: string;
  activo: boolean;
}

export interface CreateUsuarioDto {
  nombre: string;
  email: string;
  password: string;
  rol?: string;
}

export interface UpdateUsuarioDto {
  nombre?: string;
  email?: string;
  password_hash?: string;
  rol?: string;
  activo?: boolean;
}
