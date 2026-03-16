"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import { casasService } from "../../services/casasService"
import { visitasService } from "../../services/visitasService"
import { supabase } from "../../lib/supabaseClient"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function DashboardAdmin() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const [utilizadores, setUtilizadores] = useState([])
  const [todasCasas, setTodasCasas] = useState([])
  const [todasVisitas, setTodasVisitas] = useState([])
  const [loading, setLoading] = useState(false)
  const [aba, setAba] = useState("visao")
  const [roleEditando, setRoleEditando] = useState({})

  const nomeUtilizador = user?.user_metadata?.nome || user?.email

  useEffect(() => { carregarDados() }, []) 

  const carregarDados = async () => {
    try {
      setLoading(true)
      const casas = await casasService.listarCasas()
      setTodasCasas(casas)
      const visitas = await visitasService.obterTodasVisitas?.() || []
      setTodasVisitas(visitas)
      const { data: profiles } = await supabase.from("profiles").select("id, role")
      const { data: { users } } = await supabase.auth.admin?.listUsers() || { data: { users: [] } }
      // Combina profiles com metadata
      const utilizadoresComRole = (profiles || []).map(p => ({
        id: p.id,
        role: p.role,
        email: users?.find(u => u.id === p.id)?.email || "—",
        nome: users?.find(u => u.id === p.id)?.user_metadata?.nome || "—",
      }))
      setUtilizadores(utilizadoresComRole)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const mudarRole = async (userId, novoRole) => {
    try {
      await supabase.from("profiles").update({ role: novoRole }).eq("id", userId)
      setUtilizadores(prev => prev.map(u => u.id === userId ? { ...u, role: novoRole } : u))
    } catch { alert("Erro ao atualizar role") }
  }

  const deletarCasa = async (id) => {
    if (confirm("Tens a certeza que queres deletar esta casa?")) {
      try { await casasService.deletarCasa(id); carregarDados() }
      catch { alert("Erro ao deletar") }
    }
  }

  const estatisticas = [
    { label: "Total de Utilizadores", valor: utilizadores.length, cor: "from-blue-500 to-blue-700", emoji: "👥" },
    { label: "Casas Publicadas", valor: todasCasas.length, cor: "from-blue-700 to-blue-900", emoji: "🏠" },
    { label: "Visitas Totais", valor: todasVisitas.length, cor: "from-blue-400 to-blue-600", emoji: "📅" },
    { label: "Intermediários", valor: utilizadores.filter(u => u.role === "intermediario").length, cor: "from-blue-800 to-blue-950", emoji: "🤝" },
  ]

  const abas = [
    { id: "visao", label: "Visão Geral" },
    { id: "utilizadores", label: `Utilizadores (${utilizadores.length})` },
    { id: "casas", label: `Casas (${todasCasas.length})` },
    { id: "visitas", label: `Visitas (${todasVisitas.length})` },
  ]

  const badgeRole = (role) => {
    const map = { admin: "bg-red-100 text-red-700", intermediario: "bg-blue-100 text-blue-700", cliente: "bg-green-100 text-green-700" }
    return map[role] || "bg-gray-100 text-gray-700"
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">

        {/* Header */}
        <div className="bg-linear-to-r from-blue-900 to-blue-700 pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">Painel de Administração</p>
                <h1 className="text-4xl font-bold text-white mb-2">Olá, {nomeUtilizador}!</h1>
                <p className="text-blue-200">Gestão completa da plataforma</p>
              </div>
              <button onClick={() => logout().then(() => router.push("/"))} className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition">Sair</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {estatisticas.map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                  <p className="text-2xl mb-1">{stat.emoji}</p>
                  <p className="text-3xl font-bold text-white">{stat.valor}</p>
                  <p className="text-blue-200 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
            {abas.map((a) => (
              <button key={a.id} onClick={() => setAba(a.id)}
                className={`pb-4 px-2 font-semibold text-sm whitespace-nowrap transition ${aba === a.id ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                {a.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-40">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* ABA: Visão Geral */}
              {aba === "visao" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg">Distribuição de Roles</h3>
                    {["admin", "intermediario", "cliente"].map(r => {
                      const count = utilizadores.filter(u => u.role === r).length
                      const pct = utilizadores.length ? Math.round((count / utilizadores.length) * 100) : 0
                      return (
                        <div key={r} className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize text-gray-700">{r}</span>
                            <span className="font-semibold text-gray-800">{count}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg">Casas Recentes</h3>
                    {todasCasas.slice(0, 5).map(casa => (
                      <div key={casa.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-700 truncate max-w-[60%]">{casa.titulo}</span>
                        <span className="text-xs font-semibold text-blue-600">{new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", minimumFractionDigits: 0 }).format(casa.preco)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABA: Utilizadores */}
              {aba === "utilizadores" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Todos os Utilizadores</h2>
                  <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-blue-900 text-white">
                        <tr>
                          <th className="text-left px-6 py-4 font-semibold">Nome</th>
                          <th className="text-left px-6 py-4 font-semibold">Email</th>
                          <th className="text-left px-6 py-4 font-semibold">Role Atual</th>
                          <th className="text-left px-6 py-4 font-semibold">Alterar Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {utilizadores.length === 0 ? (
                          <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Nenhum utilizador encontrado</td></tr>
                        ) : utilizadores.map((u, i) => (
                          <tr key={u.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-6 py-4 font-medium text-gray-800">{u.nome}</td>
                            <td className="px-6 py-4 text-gray-600">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeRole(u.role)}`}>{u.role}</span>
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={u.role}
                                onChange={e => mudarRole(u.id, e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="cliente">cliente</option>
                                <option value="intermediario">intermediario</option>
                                <option value="admin">admin</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ABA: Casas */}
              {aba === "casas" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Todas as Casas</h2>
                  <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-blue-900 text-white">
                        <tr>
                          <th className="text-left px-6 py-4 font-semibold">Título</th>
                          <th className="text-left px-6 py-4 font-semibold">Localização</th>
                          <th className="text-left px-6 py-4 font-semibold">Preço</th>
                          <th className="text-left px-6 py-4 font-semibold">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todasCasas.length === 0 ? (
                          <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Nenhuma casa encontrada</td></tr>
                        ) : todasCasas.map((casa, i) => (
                          <tr key={casa.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-6 py-4 font-medium text-gray-800">{casa.titulo}</td>
                            <td className="px-6 py-4 text-gray-600">{casa.localizacao || "—"}</td>
                            <td className="px-6 py-4 font-semibold text-blue-600">{new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", minimumFractionDigits: 0 }).format(casa.preco)}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => router.push(`/casas/${casa.id}`)} className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-xs">Ver</button>
                                <button onClick={() => deletarCasa(casa.id)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-xs">Deletar</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ABA: Visitas */}
              {aba === "visitas" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Todas as Visitas</h2>
                  {todasVisitas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-40 bg-white rounded-xl border border-gray-100">
                      <p className="text-gray-400">Nenhuma visita registada</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-blue-900 text-white">
                          <tr>
                            <th className="text-left px-6 py-4 font-semibold">Casa</th>
                            <th className="text-left px-6 py-4 font-semibold">Data</th>
                            <th className="text-left px-6 py-4 font-semibold">Hora</th>
                            <th className="text-left px-6 py-4 font-semibold">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {todasVisitas.map((visita, i) => (
                            <tr key={visita.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-6 py-4 font-medium text-gray-800">{visita.casas?.titulo || "—"}</td>
                              <td className="px-6 py-4 text-gray-600">{new Date(visita.data_hora).toLocaleDateString("pt-AO")}</td>
                              <td className="px-6 py-4 text-gray-600">{new Date(visita.data_hora).toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" })}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${visita.status === "agendada" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{visita.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}