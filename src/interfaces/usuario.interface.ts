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
}

export interface UpdateUsuarioDto {
  nombre?: string;
  email?: string;
  password_hash?: string;
  rol?: string;
  activo?: boolean;
}

export interface ResponseUsuario{
  id: string;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
}
