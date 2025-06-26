export interface OtrosGastos {
  id: string;
  descripcion: string;
  monto: number;
  fecha: string;
}

export interface CreateOtrosGastosDto {
  descripcion: string;
  monto: number;
  fecha: string;
}

export interface UpdateOtrosGastosDto {
  descripcion?: string;
  monto?: number;
  fecha?: string;
}
