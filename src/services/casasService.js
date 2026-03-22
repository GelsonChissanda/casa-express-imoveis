import { supabase } from "../lib/supabaseClient";

export const casasService = {
  async listarCasas() {
    const { data, error } = await supabase
      .from("casas")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async obterCasa(id) {
    const { data, error } = await supabase
      .from("casas")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async criarCasa(casa) {
    const { data, error } = await supabase
      .from("casas")
      .insert([casa])
      .select();
    if (error) throw error;
    return data[0];
  },

  async atualizarCasa(id, updates) {
    const { data, error } = await supabase
      .from("casas")
      .update(updates)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async deletarCasa(id) {
    const { error } = await supabase.from("casas").delete().eq("id", id);
    if (error) throw error;
  },

  async filtrarCasas(filtros) {
    let query = supabase.from("casas").select("*");

    if (filtros.preco_min) query = query.gte("preco", filtros.preco_min);
    if (filtros.preco_max) query = query.lte("preco", filtros.preco_max);
    if (filtros.area) query = query.gte("area", filtros.area);
    if (filtros.quartos) query = query.eq("quartos", filtros.quartos);
    if (filtros.cidade) query = query.ilike("cidade", `%${filtros.cidade}%`);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};
