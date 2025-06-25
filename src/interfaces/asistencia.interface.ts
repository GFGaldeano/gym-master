export interface Asistencia {
  id: string;
  socio_id: string;
  fecha: string; // YYYY-MM-DD
  hora_ingreso: string; // ISO string o HH:mm:ssZ
  hora_egreso: string; // ISO string o HH:mm:ssZ
}

export interface CreateAsistenciaDto {
  socio_id: string;
  fecha: string;
  hora_ingreso: string;
  hora_egreso: string;
}

export interface UpdateAsistenciaDto {
  socio_id?: string;
  fecha?: string;
  hora_ingreso?: string;
  hora_egreso?: string;
}
