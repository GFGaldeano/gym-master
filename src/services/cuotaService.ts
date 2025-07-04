import { supabase } from "./supabaseClient";
import { Cuota, CreateCuotaDto, UpdateCuotaDto } from "../interfaces/cuota.interface";
import { createSocioCuota } from "./socioCuotaService";
import dayjs from "dayjs";

export const getAllCuotas = async (): Promise<Cuota[]> => {
  const { data, error } = await supabase.from("cuota").select();
  if (error) throw new Error(error.message);
  return data as Cuota[];
};


//TODO: CREAR LOGICA NECESARIA PARA LAS VALIDACIONES DE FECHA,
export const createCuota = async (payload: CreateCuotaDto): Promise<Cuota> => {
  const { data, error } = await supabase.from("cuota").insert({...payload, activo:true})
    .select().single();
  if (error) throw new Error(error.message);

 // const {id,fecha_inicio,fecha_fin} = data;
 //await createSocioCuota({cuota_id: id,fecha_inicio ,fecha_fin});  //creo LOS socio cuota

  return data as Cuota;
};

export const updateCuota = async (id: string, updateData: UpdateCuotaDto): Promise<Cuota> => {
  const { data, error } = await supabase.from("cuota").update(updateData).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No se encontró cuota con ese id");
  return data as Cuota;
};

export const deleteCuota = async (id: string): Promise<Cuota> => {
  const { data, error } = await supabase.from("cuota").update({ activo: false }).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("No se encontró cuota con ese id");
  return data as Cuota;
};

export const getCuotaById = async (id: string): Promise<Cuota> => {
  const { data, error } = await supabase
    .from("cuota")
    .select()
    .eq("id", id)
    .single();
  if (error) {
    console.log(error.message);
    throw new Error("No se encontró la cuota con ese id");
  }
  return data as Cuota;
};


export async function actualizarEstadosCuotasVencidas() {
  const hoy = dayjs().format("YYYY-MM-DD");
  // Traer todas las filas pendientes con fecha_vencimiento igual a hoy
  const { data, error } = await supabase
    .from("socio_cuota")
    .select("id, estado, fecha_vencimiento")
    .eq("estado", "pendiente")
    .eq("fecha_vencimiento", hoy);

  if (error) throw new Error(error.message);

  //si no hay cuotas vencidas, retorna vacio
  if(data.length === 0){
    return []
  }

  // Actualizar el estado a 'vencida' para cada registro encontrado
    const response =  Promise.all(data.map( async row => {
      await supabase
      .from("socio_cuota")
      .update({ estado: "vencida" })
      .eq("id", row.id);
  })
)
return response;
}