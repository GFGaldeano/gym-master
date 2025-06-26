import { supabase } from "./supabaseClient";
import { Venta, CreateVentaDto, UpdateVentaDto } from "../interfaces/venta.interface";

export const getAllVentas = async (): Promise<Venta[]> => {
  const { data, error } = await supabase.from("venta").select();
  if (error) throw new Error(error.message);
  return data as Venta[];
};

export const createVenta = async (payload: CreateVentaDto): Promise<Venta> => {
  const { data, error } = await supabase.from("venta").insert(payload).select().single();
  if (error) throw new Error(error.message);
  return data as Venta;
};

export const updateVenta = async (id: string, updateData: UpdateVentaDto): Promise<Venta> => {
  const { data, error } = await supabase.from("venta").update(updateData).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No se encontró venta con ese id");
  return data as Venta;
};

export const deleteVenta = async (id: string): Promise<Venta[]> => {
  const { data, error } = await supabase.from("venta").delete().eq("id", id).select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No se encontró venta con ese id");
  return data as Venta[];
};
