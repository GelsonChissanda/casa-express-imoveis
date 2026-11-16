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
    const { data: visitas, error } = await supabase
      .from('visitas')
      .select('*, casas(*)')
      .eq('usuario_id', usuarioId)
    if (error) throw error
    return visitas
  },

  async obterTodasVisitas() {
    const { data: visitas, error } = await supabase
      .from('visitas')
      .select('*, casas(titulo)')
    if (error) throw error
    const userIds = [...new Set(visitas.map(v => v.usuario_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, nome, email')
      .in('id', userIds)
    return visitas.map(v => ({
      ...v,
      profiles: profiles?.find(p => p.id === v.usuario_id) || null
    }))
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
    async enviarMensagem(visitaId, autorId, texto) {
    const { data, error } = await supabase
      .from('mensagens_visita')
      .insert([{ visita_id: visitaId, autor_id: autorId, texto }])
      .select()
    if (error) throw error
    return data[0]
  },

  async obterMensagens(visitaId) {
    const { data, error } = await supabase
      .from('mensagens_visita')
      .select('*')
      .eq('visita_id', visitaId)
      .order('created_at')
    if (error) throw error
    return data
  },
    async obterVisitasDasMinhasCasas(donoId) {
    const { data: visitas, error } = await supabase
      .from('visitas')
      .select('*, casas!inner(titulo, usuario_id), mensagens_visita(*)')
      .eq('casas.usuario_id', donoId)
    if (error) throw error
    const ids = [...new Set(visitas.map(v => v.usuario_id))]
    const { data: clientes } = await supabase
      .from('intermediarios_publicos')
      .select('id, nome, whatsapp, telefone')
      .in('id', ids)
    return visitas.map(v => ({
      ...v,
      cliente: clientes?.find(c => c.id === v.usuario_id) || null
    }))
  },
}
