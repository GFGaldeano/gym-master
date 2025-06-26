export interface Venta {
  id: string;
  socio_id: string;
  total: number;
  fecha: string;
}

export interface CreateVentaDto {
  socio_id: string;
  total: number;
  fecha: string;
}

export interface UpdateVentaDto {
  socio_id?: string;
  total?: number;
  fecha?: string;
}
