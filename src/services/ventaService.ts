import { supabase } from "./supabaseClient";
import { Venta, CreateVentaDto, UpdateVentaDto, CreateVentaConDetalleDto, ResponseVenta } from "../interfaces/venta.interface";
import { createVentaDetalle } from "./ventaDetalleService";
import { getSocioById } from "./socioService";

export const getAllVentas = async (): Promise<ResponseVenta[]> => {
  const { data, error } = await supabase.from("venta").select(`*,
     venta_detalle: id_venta_detalle(*),
     socio: socio_id (id_socio, nombre_completo)`);
  if (error) throw new Error(error.message);
const response : ResponseVenta[] = data.map((venta)=>{
  return {
    id: venta.id,
    total: venta.total,
    fecha: venta.fecha,
    activo: venta.activo,
    venta_detalle: venta.venta_detalle,
    socio: {
      socio_id: venta.socio.id_socio,
      nombre_completo: venta.socio.nombre_completo
    }
  };
})

return response;

 // return data as Venta[];
};

export const createVenta = async (payload: CreateVentaConDetalleDto): Promise<ResponseVenta> => {
    const{venta,venta_detalle} = payload;

    const socio = await getSocioById(venta.socio_id)

  const { data, error } = await supabase.from("venta").insert({...venta,total:1}).select().single();
  if (error) throw new Error(error.message);
 
const det_venta = await createVentaDetalle(venta_detalle, data.id);

if(det_venta === false) {
    await deleteVenta( data.id ); // Eliminar la venta si falla al crear los detalles
    throw new Error("Error al crear la venta");
}


//modifico el total de la venta
await updateVenta(data.id, { total: det_venta.subtotal, id_venta_detalle : det_venta.id });

  const response : ResponseVenta = {
    id: data.id,
    fecha: data.fecha,
    total: det_venta.subtotal,
    venta_detalle: det_venta,
    socio:{
      socio_id: socio.id_socio,
      nombre_completo: socio.nombre_completo
   }
  } 
  return response;
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

//TODO: FALTA IMPLEMENTAR BIDIRECCIONALIDAD EN DETALLE VENTA PARA MOSTRAR AL TRAER LA VENTA
export const getVentaById = async (id: string): Promise<Venta> => {
  const { data, error } = await supabase
    .from("venta")
    .select('*')
    .eq("id", id)
    .single();
  if (error) {
    console.log(error.message);
    throw new Error("No se encontró la venta con ese id");
  }

  return data;
};
