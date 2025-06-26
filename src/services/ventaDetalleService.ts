import { supabase } from "./supabaseClient";
import { VentaDetalle, CreateVentaDetalleDto, UpdateVentaDetalleDto } from "../interfaces/venta_detalle.interface";

export const getAllVentaDetalles = async (): Promise<VentaDetalle[]> => {
  const { data, error } = await supabase.from("venta_detalle").select();
  if (error) throw new Error(error.message);
  return data as VentaDetalle[];
};

export const createVentaDetalle = async (payload: CreateVentaDetalleDto): Promise<VentaDetalle> => {
  const { data, error } = await supabase.from("venta_detalle").insert(payload).select().single();
  if (error) throw new Error(error.message);
  return data as VentaDetalle;
};

export const updateVentaDetalle = async (id: string, updateData: UpdateVentaDetalleDto): Promise<VentaDetalle> => {
  const { data, error } = await supabase.from("venta_detalle").update(updateData).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No se encontró detalle de venta con ese id");
  return data as VentaDetalle;
};

export const deleteVentaDetalle = async (id: string): Promise<VentaDetalle[]> => {
  const { data, error } = await supabase.from("venta_detalle").delete().eq("id", id).select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No se encontró detalle de venta con ese id");
  return data as VentaDetalle[];
};
