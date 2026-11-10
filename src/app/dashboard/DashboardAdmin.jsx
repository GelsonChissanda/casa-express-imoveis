"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, animate } from "framer-motion"
import {
  Users,
  Building2,
  CalendarDays,
  UserCog,
  LogOut,
  Search,
  Trash2,
  Eye,
  ShieldCheck,
  MessageCircle,
  Home,
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { casasService } from "../../services/casasService"
import { visitasService } from "../../services/visitasService"
import { supabase } from "../../lib/supabaseClient"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

const formatarPreco = (v) =>
  new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(v)

const linkWhatsapp = (n) => {
  const d = (n || "").replace(/\D/g, "")
  if (!d) return null
  return `https://wa.me/${d.length === 9 ? "244" + d : d}`
}

const estiloRole = {
  admin: "bg-slate-900 text-white",
  intermediario: "bg-blue-100 text-blue-700",
  cliente: "bg-cyan-100 text-cyan-700",
}

const corRole = {
  admin: "#0f172a",
  intermediario: "#2563eb",
  cliente: "#22d3ee",
}

const estiloStatus = {
  agendada: "bg-emerald-100 text-emerald-700",
  cancelada: "bg-rose-100 text-rose-600",
}

function Contador({ valor }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const controls = animate(0, valor, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [valor])
  return <>{n}</>
}

function Donut({ dados, total }) {
  const raio = 40
  const circ = 2 * Math.PI * raio
  let acumulado = 0
  return (
    <div className="relative w-44 h-44 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={raio} fill="none" stroke="#e2e8f0" strokeWidth="12" />
        {total > 0 &&
          dados.map((d, i) => {
            const tamanho = (d.valor / total) * circ
            const offset = acumulado
            acumulado += tamanho
            return (
              <motion.circle
                key={d.role}
                cx="50"
                cy="50"
                r={raio}
                fill="none"
                stroke={corRole[d.role]}
                strokeWidth="12"
                strokeDashoffset={-offset}
                initial={{ strokeDasharray: `0 ${circ}` }}
                animate={{ strokeDasharray: `${tamanho} ${circ - tamanho}` }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.8, ease: "easeOut" }}
              />
            )
          })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-slate-900 leading-none">
          <Contador valor={total} />
        </span>
        <span className="text-slate-400 text-xs mt-1">utilizadores</span>
      </div>
    </div>
  )
}

function Avatar({ u }) {
  if (u.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={u.avatar_url}
        alt={u.nome || "Utilizador"}
        referrerPolicy="no-referrer"
        className="w-10 h-10 rounded-xl object-cover"
      />
    )
  }
  return (
    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
      {(u.nome || u.email || "?")[0].toUpperCase()}
    </div>
  )
}

function Miniatura({ casa }) {
  return (
    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
      {casa.imagem_url ? (
        <Image src={casa.imagem_url} alt={casa.titulo} width={48} height={48} className="w-full h-full object-cover" />
      ) : (
        <Home className="w-5 h-5 text-slate-300" />
      )}
    </div>
  )
}

function SelectRole({ u, onChange, desativado }) {
  return (
    <select
      value={u.role}
      disabled={desativado}
      onChange={(e) => onChange(u.id, e.target.value)}
      className="border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
    >
      <option value="cliente">cliente</option>
      <option value="intermediario">intermediario</option>
      <option value="admin">admin</option>
    </select>
  )
}

function Tabela({ colunas, children }) {
  return (
    <div className="hidden md:block bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-950 text-slate-300">
          <tr>
            {colunas.map((c) => (
              <th key={c} className="text-left px-6 py-4 font-semibold text-xs uppercase tracking-wider">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  )
}

function Vazio({ icone: Icone, texto }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 bg-white rounded-3xl border border-dashed border-slate-200">
      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
        <Icone className="w-8 h-8 text-blue-600" />
      </div>
      <p className="text-slate-500 text-sm">{texto}</p>
    </div>
  )
}

export default function DashboardAdmin() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const [utilizadores, setUtilizadores] = useState([])
  const [todasCasas, setTodasCasas] = useState([])
  const [todasVisitas, setTodasVisitas] = useState([])
  const [loading, setLoading] = useState(false)
  const [aba, setAba] = useState("visao")
  const [pesquisa, setPesquisa] = useState("")

  const nomeUtilizador =
    user?.user_metadata?.nome ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email

  const primeiroNome = nomeUtilizador?.split(" ")[0]
  const avatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture

  useEffect(() => {
    carregarDados()
  }, []) // eslint-disable-line

  const carregarDados = async () => {
    try {
      setLoading(true)

      const casas = await casasService.listarCasas()
      setTodasCasas(casas)

      const visitas = (await visitasService.obterTodasVisitas?.()) || []
      setTodasVisitas(visitas)

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, role, email, nome, whatsapp, avatar_url")

      if (error) throw error
      setUtilizadores(profiles || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const mudarRole = async (userId, novoRole) => {
    try {
      const { error } = await supabase.from("profiles").update({ role: novoRole }).eq("id", userId)
      if (error) throw error
      setUtilizadores((prev) => prev.map((u) => (u.id === userId ? { ...u, role: novoRole } : u)))
    } catch {
      alert("Erro ao atualizar role")
    }
  }

  const deletarCasa = async (id) => {
    if (confirm("Tens a certeza que queres deletar esta casa?")) {
      try {
        await casasService.deletarCasa(id)
        carregarDados()
      } catch {
        alert("Erro ao deletar")
      }
    }
  }

  const contarRole = (r) => utilizadores.filter((u) => u.role === r).length
  const dadosDonut = ["admin", "intermediario", "cliente"].map((r) => ({ role: r, valor: contarRole(r) }))

  const utilizadoresFiltrados = utilizadores.filter(
    (u) =>
      u.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      u.email?.toLowerCase().includes(pesquisa.toLowerCase())
  )

  const estatisticas = [
    { label: "Total de Utilizadores", valor: utilizadores.length, icone: Users },
    { label: "Casas Publicadas", valor: todasCasas.length, icone: Building2 },
    { label: "Visitas Totais", valor: todasVisitas.length, icone: CalendarDays },
    { label: "Intermediários", valor: contarRole("intermediario"), icone: UserCog },
  ]

  const abas = [
    { id: "visao", label: "Visão Geral", icone: ShieldCheck },
    { id: "utilizadores", label: `Utilizadores (${utilizadores.length})`, icone: Users },
    { id: "casas", label: `Casas (${todasCasas.length})`, icone: Building2 },
    { id: "visitas", label: `Visitas (${todasVisitas.length})`, icone: CalendarDays },
  ]

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        {/* HERO */}
        <div className="relative overflow-hidden bg-slate-950 pt-28 pb-24">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-600/40 blur-3xl" />
          <div className="absolute top-10 right-0 w-96 h-96 rounded-full bg-cyan-400/25 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-indigo-500/30 blur-3xl" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-start gap-4"
            >
              <div className="flex items-center gap-4">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatar}
                    alt={primeiroNome || "Perfil"}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/30 shadow-xl"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                    {primeiroNome?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="flex items-center gap-1.5 text-cyan-300 text-xs font-semibold uppercase tracking-[0.2em] mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Painel de Administração
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                    <span className="bg-linear-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                      {primeiroNome}
                    </span>
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">Gestão completa da plataforma</p>
                </div>
              </div>

              <button
                onClick={() => logout().then(() => router.push("/"))}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur border border-white/15 text-white text-sm font-medium rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
              {estatisticas.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-5"
                >
                  <div className="w-11 h-11 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
                    <s.icone className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-3xl font-extrabold text-white leading-none">
                    <Contador valor={s.valor} />
                  </p>
                  <p className="text-slate-400 text-xs mt-2">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* TABS FLUTUANTES */}
        <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
          <div className="flex gap-1 p-1.5 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 w-full sm:w-fit overflow-x-auto">
            {abas.map((a) => (
              <button
                key={a.id}
                onClick={() => setAba(a.id)}
                className={`relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  aba === a.id ? "text-white" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {aba === a.id && (
                  <motion.span
                    layoutId="aba-admin"
                    className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <a.icone className="relative w-4 h-4" />
                <span className="relative">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="max-w-6xl mx-auto px-4 py-10">
          {loading ? (
            <div className="flex items-center justify-center min-h-40">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={aba}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                {/* VISÃO GERAL */}
                {aba === "visao" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                      <h3 className="font-extrabold text-slate-900 text-lg mb-6">Distribuição de Roles</h3>
                      <div className="flex flex-col sm:flex-row items-center gap-8">
                        <Donut dados={dadosDonut} total={utilizadores.length} />
                        <div className="flex-1 w-full space-y-4">
                          {dadosDonut.map((d) => {
                            const pct = utilizadores.length ? Math.round((d.valor / utilizadores.length) * 100) : 0
                            return (
                              <div key={d.role}>
                                <div className="flex items-center justify-between text-sm mb-1.5">
                                  <span className="flex items-center gap-2 capitalize text-slate-700">
                                    <span className="w-3 h-3 rounded-full" style={{ background: corRole[d.role] }} />
                                    {d.role}
                                  </span>
                                  <span className="font-bold text-slate-900">
                                    {d.valor} <span className="text-slate-400 font-medium text-xs">({pct}%)</span>
                                  </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="h-2 rounded-full"
                                    style={{ background: corRole[d.role] }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                      <h3 className="font-extrabold text-slate-900 text-lg mb-6">Casas Recentes</h3>
                      {todasCasas.length === 0 ? (
                        <p className="text-slate-400 text-sm">Ainda não há casas publicadas</p>
                      ) : (
                        <div className="space-y-3">
                          {todasCasas.slice(0, 5).map((casa, i) => (
                            <motion.div
                              key={casa.id}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.06 }}
                              className="flex items-center gap-3"
                            >
                              <Miniatura casa={casa} />
                              <span className="flex-1 text-sm font-medium text-slate-700 truncate">{casa.titulo}</span>
                              <span className="text-xs font-bold text-blue-600 whitespace-nowrap">
                                {formatarPreco(casa.preco)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* UTILIZADORES */}
                {aba === "utilizadores" && (
                  <div>
                    <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                      <h2 className="text-2xl font-extrabold text-slate-900">Todos os Utilizadores</h2>
                      <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Pesquisar por nome ou email..."
                          value={pesquisa}
                          onChange={(e) => setPesquisa(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {utilizadoresFiltrados.length === 0 ? (
                      <Vazio icone={Users} texto="Nenhum utilizador encontrado" />
                    ) : (
                      <>
                        <Tabela colunas={["Utilizador", "Email", "WhatsApp", "Role", "Alterar Role"]}>
                          {utilizadoresFiltrados.map((u) => {
                            const wa = linkWhatsapp(u.whatsapp)
                            return (
                              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar u={u} />
                                    <span className="font-semibold text-slate-900">{u.nome || "—"}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{u.email || "—"}</td>
                                <td className="px-6 py-4">
                                  {wa ? (
                                    <a
                                      href={wa}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" /> {u.whatsapp}
                                    </a>
                                  ) : (
                                    <span className="text-slate-300">—</span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estiloRole[u.role] || "bg-slate-100 text-slate-600"}`}>
                                    {u.role}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <SelectRole u={u} onChange={mudarRole} desativado={u.id === user?.id} />
                                </td>
                              </tr>
                            )
                          })}
                        </Tabela>

                        <div className="md:hidden space-y-3">
                          {utilizadoresFiltrados.map((u) => {
                            const wa = linkWhatsapp(u.whatsapp)
                            return (
                              <div key={u.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
                                <div className="flex items-center gap-3 mb-3">
                                  <Avatar u={u} />
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-900 truncate">{u.nome || "—"}</p>
                                    <p className="text-slate-500 text-xs truncate">{u.email || "—"}</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estiloRole[u.role] || "bg-slate-100 text-slate-600"}`}>
                                    {u.role}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {wa && (
                                      <a
                                        href={wa}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 bg-emerald-50 text-emerald-700 rounded-xl"
                                        aria-label="WhatsApp"
                                      >
                                        <MessageCircle className="w-4 h-4" />
                                      </a>
                                    )}
                                    <SelectRole u={u} onChange={mudarRole} desativado={u.id === user?.id} />
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* CASAS */}
                {aba === "casas" && (
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-8">Todas as Casas</h2>
                    {todasCasas.length === 0 ? (
                      <Vazio icone={Building2} texto="Nenhuma casa encontrada" />
                    ) : (
                      <>
                        <Tabela colunas={["Casa", "Bairro", "Preço", "Ações"]}>
                          {todasCasas.map((casa) => (
                            <tr key={casa.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <Miniatura casa={casa} />
                                  <span className="font-semibold text-slate-900">{casa.titulo}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-slate-500">{casa.bairro || "—"}</td>
                              <td className="px-6 py-4 font-bold text-blue-600">{formatarPreco(casa.preco)}</td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => router.push(`/casas/${casa.id}`)}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" /> Ver
                                  </button>
                                  <button
                                    onClick={() => deletarCasa(casa.id)}
                                    className="px-3 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer"
                                    aria-label="Deletar"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </Tabela>

                        <div className="md:hidden space-y-3">
                          {todasCasas.map((casa) => (
                            <div key={casa.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <Miniatura casa={casa} />
                                <div className="min-w-0">
                                  <h3 className="font-bold text-slate-900 truncate">{casa.titulo}</h3>
                                  <p className="text-slate-500 text-xs">{casa.bairro || "—"}</p>
                                </div>
                              </div>
                              <p className="text-blue-600 font-bold mb-3">{formatarPreco(casa.preco)}</p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => router.push(`/casas/${casa.id}`)}
                                  className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold"
                                >
                                  Ver
                                </button>
                                <button
                                  onClick={() => deletarCasa(casa.id)}
                                  className="flex-1 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold"
                                >
                                  Deletar
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* VISITAS */}
                {aba === "visitas" && (
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-8">Todas as Visitas</h2>
                    {todasVisitas.length === 0 ? (
                      <Vazio icone={CalendarDays} texto="Nenhuma visita registada" />
                    ) : (
                      <>
                        <Tabela colunas={["Casa", "Pessoa", "Data", "Hora", "Estado"]}>
                          {todasVisitas.map((visita) => (
                            <tr key={visita.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-semibold text-slate-900">{visita.casas?.titulo || "—"}</td>
                              <td className="px-6 py-4 text-slate-500">{visita.profiles?.nome || "—"}</td>
                              <td className="px-6 py-4 text-slate-500">
                                {new Date(visita.data_hora).toLocaleDateString("pt-AO")}
                              </td>
                              <td className="px-6 py-4 text-slate-500">
                                {new Date(visita.data_hora).toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" })}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${estiloStatus[visita.status] || "bg-slate-100 text-slate-500"}`}>
                                  {visita.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </Tabela>

                        <div className="md:hidden space-y-3">
                          {todasVisitas.map((visita) => (
                            <div key={visita.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
                              <h3 className="font-bold text-slate-900 mb-1">{visita.casas?.titulo || "—"}</h3>
                              <p className="text-slate-500 text-sm">{visita.profiles?.nome || "—"}</p>
                              <p className="text-slate-400 text-xs mt-1">
                                {new Date(visita.data_hora).toLocaleDateString("pt-AO")} às{" "}
                                {new Date(visita.data_hora).toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold capitalize ${estiloStatus[visita.status] || "bg-slate-100 text-slate-500"}`}>
                                {visita.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}