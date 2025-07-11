import { CreateMantenimientoDTO, Mantenimiento, UpdateMantenimientoDTO } from "@/interfaces/mantenimiento.interface";
import { supabase } from "./supabaseClient"
import { getOneEquipamientoById, updateEquipamiento } from "./equipamientoService";
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
    const estado = payload.estado || 'en proceso';
    
    const { data, error } = await supabase
        .from('mantenimiento')
        .insert({...payload, observaciones, fecha_mantenimiento, estado})
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

// Helper function to update equipment when maintenance is completed
const updateEquipamientoAfterMaintenance = async (id_equipamiento: string, fecha_completado: string) => {
    try {
        const ultimaRevision = fecha_completado;
        const proximaRevision = dayjs(fecha_completado).add(3, 'month').format("YYYY-MM-DD");
        
        await updateEquipamiento(id_equipamiento, {
            estado: 'operativo',
            ultima_revision: ultimaRevision,
            proxima_revision: proximaRevision
        });
    } catch (error) {
        throw new Error(`Error al actualizar equipamiento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
};

export const updateMantenimiento = async (id: string, updateData: UpdateMantenimientoDTO) : Promise<Mantenimiento> => {
    // Get the current maintenance record to check the previous status
    const { data: currentData, error: currentError } = await supabase
        .from('mantenimiento')
        .select('estado, id_equipamiento')
        .eq('id', id)
        .single();
    
    if (currentError) {
        throw new Error(currentError.message);
    }

    const { data, error } = await supabase
        .from('mantenimiento')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        throw new Error(error.message);
    }

    // Check if the status changed to "completado" and update equipment accordingly
    if (updateData.estado === 'completado' && currentData.estado !== 'completado') {
        const fechaCompletado = updateData.fecha_mantenimiento || dayjs().format("YYYY-MM-DD");
        await updateEquipamientoAfterMaintenance(data.id_equipamiento, fechaCompletado);
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