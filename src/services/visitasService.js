import { supabase } from '../lib/supabaseClient'

export const visitasService = {
  async marcarVisita(visita) {
    const { data, error } = await supabase
      .from('visitas')
      .insert([visita])
      .select()
    if (error) throw error
    return data[0]
  },

  async obterMinhasVisitas(usuarioId) {
    const { data, error } = await supabase
      .from('visitas')
      .select('*, casas(*)')
      .eq('usuario_id', usuarioId)
    if (error) throw error
    return data
  },

  async cancelarVisita(id) {
    const { error } = await supabase.from('visitas').delete().eq('id', id)
    if (error) throw error
  },

  async atualizarStatusVisita(id, status) {
    const { data, error } = await supabase
      .from('visitas')
      .update({ status })
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },
}
