import { CreateSocioCuotaDto, SocioCuota } from "@/interfaces/socio_cuota.interface";
import { supabase } from '@/services/supabaseClient';
import { getAllSociosActivos } from "./socioService";

// SE TIENE QUE PASAR EL ID de todos los usuarios activos
export const createSocioCuota = async (payload:CreateSocioCuotaDto) : Promise<SocioCuota[]> =>{
    const { cuota_id, fecha_fin, fecha_inicio } = payload;

  //*
    const socios  = await getAllSociosActivos();

   const socios_cuotas=  Promise.all(socios.map(async (socio) =>{
        const { data, error } = await supabase
            .from("socio_cuota")
            .insert({
                socio_id: socio.id_socio,
                cuota_id,
                fecha_asignacion: new Date().toISOString(), // fecha de cuando se crea
                fecha_vencimiento: fecha_fin, // es la fecha de la cuota
                estado: "pendiente",
                activo: true
            })
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }))
    return socios_cuotas;
//*/
  /*  const { data, error } = await supabase
        .from("socio_cuota")
        .insert({
            socio_id: "2c2af6cb-1e8d-4557-8c69-9ffe76a5afa7" ,
            cuota_id,
            fecha_asignacion: fecha_inicio,
            fecha_vencimiento:fecha_fin, // es la fecha de la cuota
            estado: "pendiente",
            activo: true 
        })
        .select();

    if (error) {
        throw new Error(error.message);
    }

    //no va a importar mucho el retorno, siendo que no voy a utilziarlo en una ruta
    return data;
*/
}

export const updateEstadoSocioCuota = async (socio_cuota_id: string, estado: string): Promise<SocioCuota> => {
    const { data, error } = await supabase
        .from("socio_cuota")
        .update({ estado })
        .eq("id", socio_cuota_id)
        .select()
        .single();

    if (error) {
        console.log(error.message);
        throw new Error("Error al actualizar el estado de la socio cuota");
    }

    return data as SocioCuota;
}