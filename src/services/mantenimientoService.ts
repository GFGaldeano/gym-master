import { CreateMantenimientoDTO, Mantenimiento, UpdateMantenimientoDTO } from "@/interfaces/mantenimiento.interface";
import { supabase } from "./supabaseClient"
import { getOneEquipamientoById } from "./equipamientoService";
import dayjs from "dayjs";

export const getMantenimientoByIdEquipamiento = async (id: string) : Promise<Mantenimiento[]>=> {
    const equipamiento = await getOneEquipamientoById(id);
    if (!equipamiento) {
        throw new Error(`No se encontró el equipamiento con ID: ${id}`);
    }

    const { data, error } = await supabase
        .from('mantenimiento')
        .select()
        .eq('id_equipamiento', id)

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export const createMantenimiento = async (payload: CreateMantenimientoDTO) : Promise<Mantenimiento>=> {
    const observaciones = payload.observaciones || 'Sin observaciones';
    const fecha_mantenimiento = payload.fecha_mantenimiento || dayjs().format("YYYY-MM-DD");
    const { data, error } = await supabase
        .from('mantenimiento')
        .insert({...payload,observaciones, fecha_mantenimiento})
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export const updateMantenimiento = async (id: string, updateData: UpdateMantenimientoDTO) : Promise<Mantenimiento> => {
    const { data, error } = await supabase
        .from('mantenimiento')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
    if (error) {
        throw new Error(error.message);
    }

    return data;
}
export const getAllMantenimientos = async () : Promise<Mantenimiento[]> => {
    const { data, error } = await supabase
        .from('mantenimiento')
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}