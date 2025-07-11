export interface Mantenimiento{
    id: string;
    id_equipamiento: string;
    tipo_mantenimiento: string; // preventivo / correctivo
    descripcion: string;
    fecha_mantenimiento: string;
    tecnico_responsable: string;
    costo: number; 
    observaciones: string; 
    estado:string; //en proceso / completado
}

export interface CreateMantenimientoDTO {
    id_equipamiento: string;
    tipo_mantenimiento: string; // preventivo / correctivo
    descripcion: string;
    fecha_mantenimiento?: string;
    tecnico_responsable: string;
    costo: number; 
    observaciones?: string; // opcional, por defecto "Sin observaciones"
}
export interface UpdateMantenimientoDTO {
    id_equipamiento?: string;
    tipo_mantenimiento?: string; // preventivo / correctivo
    descripcion?: string;
    fecha_mantenimiento?: string;
    tecnico_responsable?: string;
    costo?: number; 
    observaciones?: string; // opcional, por defecto "Sin observaciones"
    estado?:string;
}