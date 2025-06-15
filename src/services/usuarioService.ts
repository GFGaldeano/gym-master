import bcrypt from 'bcryptjs';
import { supabase } from './supabaseClient';

export const fetchUsuarios = async () => {
  const { data, error } = await supabase
    .from('usuario') // o 'usuarios' según corresponda
    .select('*');

  console.log("FETCH DATA:", data);
  console.error("FETCH ERROR:", error);

  if (error) throw new Error(error.message);
  return data;
};


export const createUsuarios = async (nombre: string, email: string, password_plain: string) => {
  const password_hash = await bcrypt.hash(password_plain, 10);

  const { data, error } = await supabase
    .from('usuario')
    .insert([{ nombre, email, password_hash, rol: 'socio' }])
    .select();

  if (error) throw new Error(error.message);
  return data;
};

export const updateUsuarios = async (
  id: string,
  updateData: { nombre?: string; email?: string; password_hash?: string }
) => {
  const { data, error } = await supabase
    .from('usuario')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);

  if (!data || data.length === 0) {
    throw new Error('No se encontró el usuario con ese ID');
  }

  return data;
};


export const deleteUsuarios = async (id: string) => {
  const { data, error } = await supabase
    .from('usuario')
    .update({ activo: false })
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);

  if (!data || data.length === 0) {
    throw new Error('No se encontró el usuario con ese ID');
  }
};

