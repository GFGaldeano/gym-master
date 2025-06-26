import { supabase } from "./supabaseClient";
import { Producto, CreateProductoDto, UpdateProductoDto } from "../interfaces/producto.interface";
import { existeProveedor } from "./proveedorService";

export const getAllProductos = async (): Promise<Producto[]> => {
  const { data, error } = await supabase.from("producto").select();
  if (error) throw new Error(error.message);
  return data as Producto[];
};

export const createProducto = async (payload: CreateProductoDto): Promise<Producto> => {
    const {proveedor_id} = payload;
    const proveedor = await existeProveedor(proveedor_id);
    if(!proveedor) throw new Error("El proveedor ingresado no existe");

  const { data, error } = await supabase.from("producto").insert(payload).select().single();
  if (error) throw new Error(error.message);
  return data as Producto;
};

export const updateProducto = async (id: string, updateData: UpdateProductoDto): Promise<Producto> => {
  const { data, error } = await supabase.from("producto").update(updateData).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No se encontró producto con ese id");
  return data as Producto;
};

export const deleteProducto = async (id: string): Promise<Producto[]> => {
  const { data, error } = await supabase.from("producto").delete().eq("id", id).select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No se encontró producto con ese id");
  return data as Producto[];
};
