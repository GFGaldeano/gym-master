import bcrypt from 'bcryptjs';
import { supabase } from './supabaseClient';
import { Usuario, CreateUsuarioDto, UpdateUsuarioDto, ResponseUsuario } from "../interfaces/usuario.interface";

export const fetchUsuarios = async (): Promise<ResponseUsuario[]> => {
  const { data, error } = await supabase
    .from('usuario')
    .select('*');
  if (error) throw new Error(error.message);
  const response = responseUsuario(data);
  return response; 
};

const responseUsuario = (data : Usuario[]) : ResponseUsuario[]=>{
  return data.map (usuario => ({
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    activo: usuario.activo
  }))
}

export const createUsuarios = async (payload: CreateUsuarioDto): Promise<Usuario> => {
  const password_hash = await bcrypt.hash(payload.password, 10);
  const { data, error } = await supabase
    .from('usuario')
    .insert([{ nombre: payload.nombre, email: payload.email, password_hash, rol:'socio', activo: true }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Usuario;
};

export const updateUsuarios = async (
  id: string,
  updateData: UpdateUsuarioDto
): Promise<Usuario> => {
  const { data, error } = await supabase
    .from('usuario')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error('No se encontró el usuario con ese ID');
  }
  return data as Usuario;
};

export const deleteUsuarios = async (id: string): Promise<Usuario[]> => {
  const { data, error } = await supabase
    .from('usuario')
    .update({ activo: false })
    .eq('id', id)
    .select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error('No se encontró el usuario con ese ID');
  }
  return data as Usuario[];
};

