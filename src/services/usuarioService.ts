// src/services/usuarioService.ts
import { supabase } from "./supabaseClient";
import bcrypt from "bcryptjs";

export const fetchUsuarios = async () => {
  const { data, error } = await supabase
    .from("usuario")
    .select("id, nombre, email, rol, activo, creado_en")
    .order("creado_en", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const createUsuario = async (data: {
  nombre: string;
  email: string;
  password: string;
  rol: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const { data: result, error } = await supabase.from("usuario").insert([
    {
      nombre: data.nombre,
      email: data.email,
      password_hash: hashedPassword,
      rol: data.rol,
    },
  ]);

  if (error) throw new Error(error.message);
  return result;
};
