import { supabase } from "./supabaseClient";
import { Pago, CreatePagoDto, UpdatePagoDto } from "../interfaces/pago.interface";

export const getAllPagos = async (): Promise<Pago[]> => {
  const { data, error } = await supabase.from("pago").select();
  if (error) throw new Error(error.message);
  return data as Pago[];
};

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
  const { data, error } = await supabase.from("pago").delete().eq("id", id).select().single();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No se encontró pago con ese id");
  return data as Pago;
};
