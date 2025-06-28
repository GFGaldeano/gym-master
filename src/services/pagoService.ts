import { supabase } from "./supabaseClient";
import { Pago, CreatePagoDto, UpdatePagoDto, ResponsePago } from "../interfaces/pago.interface";
import { Socio } from "@/interfaces/socio.interface";

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
    registrado_por: registrado_por( id, nombre )
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
    }
  }));
  return response;
}

export const createPago = async (payload: CreatePagoDto): Promise<Pago> => {
  const { data, error } = await supabase.from("pago").insert(payload).select().single();
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
