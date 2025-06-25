import { supabase } from './supabaseClient'

export const fetchSocios = async () => {
  const { data, error } = await supabase
    .from('socio')
    .select('*') // sin filtros
    .order('creado_en', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};


export const createSocio = async (payload: {
  usuario_id?: string;
  nombre_completo: string;
  dni: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  foto?: string;
}) => {
  const { data, error } = await supabase
    .from('socio')
    .insert([payload])
    .select()

  if (error) throw new Error(error.message)
  return data
}

export const updateSocio = async (
  id: string,
  updateData: {
    nombre_completo?: string;
    dni?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    foto?: string;
    usuario_id?: string;
    fecha_baja?: string;
  }
) => {
  const { data, error } = await supabase
    .from('socio')
    .update(updateData)
    .eq('id', id)
    .select()

  if (error) throw new Error(error.message)
  if (!data || data.length === 0) throw new Error('No se encontró el socio con ese ID')
  return data
}

export const deleteSocio = async (id: string) => {
  const { data, error } = await supabase
    .from('socio')
    .update({ activo: false })
    .eq('id', id)
    .select()

  if (error) throw new Error(error.message)
  if (!data || data.length === 0) throw new Error('No se encontró el socio con ese ID')
}

export const toggleSocioActivo = async (socio: { id_socio: string; activo: boolean }) => {
  const { data, error } = await supabase
    .from("socio")
    .update({ activo: !socio.activo })
    .eq("id_socio", socio.id_socio)
    .select();

  if (error) throw new Error(error.message);
  return data;
};

