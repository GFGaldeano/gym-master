export interface SocioCuota{
    id: string;
    socio_id: string;
    cuota_id: string;
    fecha_asignacion: string;
    fecha_vencimiento: string;
    estado:string;
    activo: boolean;
}

export interface CreateSocioCuotaDto {
    cuota_id: string;
    fecha_fin: string;
    fecha_inicio:string
}