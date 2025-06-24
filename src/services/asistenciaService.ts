import { supabase } from "./supabaseClient";
import { existeSocioActivo } from "./socioService";
import { Asistencia, CreateAsistenciaDto, UpdateAsistenciaDto } from "../interfaces/asistencia.interface"; 

export const getAllAsistencias = async (): Promise<Asistencia[]> => {
  const { data, error } = await supabase
    .from("asistencia")
    .select();
  if (error) throw new Error(error.message);
  return data as Asistencia[];
};

export const createAsistencia = async (payload: CreateAsistenciaDto): Promise<Asistencia[]> => {
  // Verificar si el socio existe antes de crear la asistencia
  const socioActivo = await existeSocioActivo(payload.socio_id);
  if (!socioActivo) {
    throw new Error("El socio no existe o está inactivo");
  }

  const { data, error } = await supabase
    .from("asistencia")
    .insert(payload)
    .select();
  if (error) throw new Error(error.message);
  return data as Asistencia[];
};



//TODO: Agregar validacion que el id del socio sea el id que se encuentra en la sesion
// o que el id de la sesion tenga rol de administradors
export const updateAsistencia = async (id: string, updateData: UpdateAsistenciaDto): Promise<Asistencia[]> => {
    const { data, error } = await supabase
    .from("asistencia")
    .update(updateData)
    .eq("id", id)
    .select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No se encontró asistencia con ese id");
  return data as Asistencia[];
};

//TODO: Agregar validacion que el id del socio sea el id que se encuentra en la sesion
// o que el id de la sesion tenga rol de administradors
export const deleteAsistencia = async (id: string): Promise<Asistencia[]> => {
  const { data, error } = await supabase
    .from("asistencia")
    .delete()
    .eq("id", id)
    .select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No se encontró asistencia con ese id");
  return data as Asistencia[];
};
