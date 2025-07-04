import { supabase } from "./supabaseClient";
import { Pago, CreatePagoDto, UpdatePagoDto, ResponsePago } from "../interfaces/pago.interface";
import { Socio } from "@/interfaces/socio.interface";
import { updateEstadoSocioCuota } from "./socioCuotaService";
import  dayjs  from 'dayjs';

/*export const getAllPagos = async (): Promise<Pago[]> => {
  const { data, error } = await supabase.from("pago").select();
  if (error) throw new Error(error.message);
  return data as Pago[];
};
*/
export const getAllPagos = async () : Promise<ResponsePago[]> => {
    
  const { data, error } = await supabase
  .from("pago")
  .select(`*, 
    socio: socio_id ( id_socio, nombre_completo ),
    cuota: cuota_id (id, descripcion, fecha_fin),
    registrado_por: registrado_por( id, nombre ),
    socio_cuota: socio_cuota_id (id, estado)
    `);
    

  if (error) throw new Error(error.message);

  const response = responseAllPagos(data as ResponsePago[]);
  return response;
};

//Genere esta funcion para transformar el formato de la respuesta y simplificar el uso en la funcion del get
const responseAllPagos = (data : ResponsePago[]) :  ResponsePago[] =>{
 const response = data.map(pago=>({
    id: pago.id,
    fecha_pago: pago.fecha_pago,
    fecha_vencimiento: pago.fecha_vencimiento,
    monto_pagado: pago.monto_pagado,
    total: pago.total,
    registrado_por:{
        id: pago.registrado_por.id,
        nombre: pago.registrado_por.nombre
    },
    cuota:{
        id: pago.cuota.id,
        descripcion: pago.cuota.descripcion
    },
    socio:{
        id_socio: pago.socio.id_socio,
        nombre_completo: pago.socio.nombre_completo
    },
    socio_cuota:{
        id: pago.socio_cuota.id,
        estado: pago.socio_cuota.estado
    }
  }));
  return response;
}

/*//TODO: CREAR LOGICA NECESARIA PARA VERIFICAR QUE EL SOCIO TENGA UNA CUOTA PENDIENTE Y QUE SEA 
// EL SOCIO CORRECTO
//TODO: VERIFICAR Y CORROBORAR EL MONTO DE PAGO
export const createPago = async (payload: CreatePagoDto): Promise<Pago> => {

  console.log(payload);
  
  const { data, error } = await supabase.from("pago").insert(payload).select().single();
  if (error) throw new Error(error.message);

  //una vez realizado el pago, se actualiza el socio_cuota
  const { socio_cuota_id } = data;
const socioCuota = await updateEstadoSocioCuota(socio_cuota_id, "pagado");
console.log("socio_Cuota",socioCuota);

  return data as Pago;
};
*/

export const createPago = async (payload: CreatePagoDto) => {

    const { data :cuota , error:cuotaError } = await supabase
  .from("cuota")
  .select()
  .order('creado_en', { ascending: false })
  .limit(1)
  .single();
  
  const id_cuota = cuota.id
  const fecha_pago = dayjs().format("YYYY-MM-DD");
  const fecha_vencimiento = dayjs(cuota.fecha_inicio).add(30, 'day').format("YYYY-MM-DD"); // fecha de vencimiento es hoy + 30 dias
  const monto_pagado = cuota.monto; // Asignar el monto de la cuota al pago

  const { socio_id, registrado_por } = payload; 


  const { data, error } = await supabase.from("pago").insert({
    socio_id,
    cuota_id: id_cuota,
    fecha_pago,
    fecha_vencimiento,
    monto_pagado,
    registrado_por,
    
  }).select().single();
  if (error) throw new Error(error.message);


  return data as Pago;
};


export const updatePago = async (id: string, updateData: UpdatePagoDto): Promise<Pago> => {
  const { data, error } = await supabase.from("pago").update(updateData).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No se encontró pago con ese id");
  return data as Pago;
};

export const deletePago = async (id: string): Promise<Pago> => {
  const { data, error } = await supabase.from("pago").update({ activo: false }).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("No se encontró pago con ese id");
  return data as Pago;
};

export const getPagoById = async (id: string): Promise<ResponsePago> => {
  const { data, error } = await supabase
    .from("pago")
      .select(`*, 
    socio: socio_id ( id_socio, nombre_completo ),
    cuota: cuota_id (id, descripcion, fecha_fin),
    registrado_por: registrado_por( id, nombre )
    `)
    .eq("id", id)
    .single();
  if (error) {
    console.log(error.message);
    throw new Error("No se encontró el pago con ese id");
  }
  const response = {
    id: data.id,
    fecha_pago: data.fecha_pago,
    fecha_vencimiento: data.fecha_vencimiento,
    monto_pagado: data.monto_pagado,
    total: data.total,
    registrado_por:{
        id: data.registrado_por.id,
        nombre: data.registrado_por.nombre
    },
    cuota:{
        id: data.cuota.id,
        descripcion: data.cuota.descripcion
    },
    socio:{
        id_socio: data.socio.id_socio,
        nombre_completo: data.socio.nombre_completo
    },
    socio_cuota:{
        id: data.socio_cuota.id,
        estado: data.socio_cuota.estado
    }
  };
  return response;
};
