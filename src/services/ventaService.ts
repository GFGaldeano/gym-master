import { supabase } from "./supabaseClient";
import { Venta, CreateVentaDto, UpdateVentaDto, CreateVentaConDetalleDto, ResponseVenta } from "../interfaces/venta.interface";
import { createVentaDetalle } from "./ventaDetalleService";

export const getAllVentas = async (): Promise<Venta[]> => {
  const { data, error } = await supabase.from("venta").select();
  if (error) throw new Error(error.message);
  return data as Venta[];
};

export const createVenta = async (payload: CreateVentaConDetalleDto): Promise<ResponseVenta> => {
    const{venta,venta_detalle} = payload;
  const { data, error } = await supabase.from("venta").insert({...venta,total:1}).select().single();
  if (error) throw new Error(error.message);
 
const det_venta = await createVentaDetalle(venta_detalle, data.id);

if(det_venta === false) {
    await deleteVenta( data.id ); // Eliminar la venta si falla al crear los detalles
    throw new Error("Error al crear la venta");
}


//modifico el total de la venta
await updateVenta(data.id, { total: det_venta.subtotal });

  const response : ResponseVenta = {
    fecha: data.fecha,
    total: det_venta.subtotal,
    socio_id: data.socio_id,
    id: data.id,
    venta_detalle: det_venta
  } 
  return response as ResponseVenta;
};

export const updateVenta = async (id: string, updateData: UpdateVentaDto): Promise<Venta> => {
  const { data, error } = await supabase.from("venta").update(updateData).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No se encontró venta con ese id");
  return data as Venta;
};

export const deleteVenta = async (id: string): Promise<Venta> => {
  const { data, error } = await supabase.from("venta").update({ activo: false }).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("No se encontró venta con ese id");
  return data as Venta;
};
