"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, animate } from "framer-motion"
import {
  Plus,
  Trash2,
  Eye,
  Building2,
  CalendarCheck,
  CalendarDays,
  Clock,
  LogOut,
  Wallet,
  TrendingUp,
  Home,
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { casasService } from "../../services/casasService"
import { visitasService } from "../../services/visitasService"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

const formatarPreco = (v) =>
  new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(v)

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

function MiniBarras({ valores }) {
  if (valores.length === 0) {
    return <p className="text-slate-400 text-xs">Publica a primeira casa para ver o gráfico</p>
  }
  const max = Math.max(...valores, 1)
  return (
    <div className="flex items-end gap-1.5 h-20">
      {valores.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${Math.max((v / max) * 100, 10)}%` }}
          transition={{ delay: 0.3 + i * 0.05, duration: 0.6, ease: "easeOut" }}
          className="flex-1 rounded-t-md bg-linear-to-t from-blue-600 to-cyan-400"
        />
      ))}
    </div>
  )
}

function CartaoBento({ className = "", children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`bg-white/8 backdrop-blur-md border border-white/10 rounded-3xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-100 animate-pulse">
          <div className="h-56 bg-slate-200" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
            <div className="h-10 bg-slate-100 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DashboardIntermediario() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const [minhasCasas, setMinhasCasas] = useState([])
  const [minhasVisitas, setMinhasVisitas] = useState([])
  const [loading, setLoading] = useState(false)
  const [aba, setAba] = useState("casas")

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
      setMinhasCasas(casas.filter((c) => c.usuario_id === user.id))
      const visitas = await visitasService.obterMinhasVisitas(user.id)
      setMinhasVisitas(visitas)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deletarCasa = async (id) => {
    if (confirm("Tem a certeza que queres deletar esta casa?")) {
      try {
        await casasService.deletarCasa(id)
        carregarDados()
      } catch {
        alert("Erro ao deletar casa")
      }
    }
  }

  const cancelarVisita = async (id) => {
    if (confirm("Tem a certeza que queres cancelar esta visita?")) {
      try {
        await visitasService.cancelarVisita(id)
        carregarDados()
      } catch {
        alert("Erro ao cancelar visita")
      }
    }
  }

  const precos = minhasCasas.map((c) => Number(c.preco) || 0)
  const valorTotal = precos.reduce((a, b) => a + b, 0)
  const precoMedio = precos.length ? valorTotal / precos.length : 0
  const visitasAgendadas = minhasVisitas.filter((v) => v.status === "agendada")
  const proximaVisita = visitasAgendadas
    .filter((v) => new Date(v.data_hora) >= new Date())
    .sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora))[0]

  const abas = [
    { id: "casas", label: `Minhas Casas (${minhasCasas.length})`, icone: Building2 },
    { id: "visitas", label: `Visitas (${minhasVisitas.length})`, icone: CalendarDays },
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
              className="flex flex-col md:flex-row md:items-center justify-between gap-6"
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
                  <p className="text-cyan-300 text-xs font-semibold uppercase tracking-[0.2em] mb-1">
                    Painel do Intermediário
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                    <span className="bg-linear-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                      {primeiroNome}
                    </span>
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">Gere as tuas casas e acompanha as visitas</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/publicarCasa")}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold shadow-lg shadow-blue-500/30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Publicar nova casa
                </motion.button>
                <button
                  onClick={() => logout().then(() => router.push("/"))}
                  className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur border border-white/15 text-white text-sm font-medium rounded-2xl hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            </motion.div>

            {/* BENTO */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
              <CartaoBento className="md:col-span-2" delay={0.1}>
                <p className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider">
                  <Wallet className="w-4 h-4 text-cyan-300" /> Valor em carteira
                </p>
                <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                  {formatarPreco(valorTotal)}
                  <span className="text-slate-500 text-sm font-medium">/mês</span>
                </p>
                <p className="flex items-center gap-1.5 text-cyan-300 text-xs mt-2 mb-5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Preço médio {formatarPreco(precoMedio)}
                </p>
                <MiniBarras valores={precos.slice(-12)} />
              </CartaoBento>

              <CartaoBento delay={0.2} className="flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="mt-6">
                  <p className="text-5xl font-extrabold text-white leading-none">
                    <Contador valor={minhasCasas.length} />
                  </p>
                  <p className="text-slate-400 text-xs mt-2">Casas publicadas</p>
                </div>
              </CartaoBento>

              <CartaoBento delay={0.3} className="flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <CalendarCheck className="w-6 h-6 text-white" />
                </div>
                <div className="mt-6">
                  <p className="text-5xl font-extrabold text-white leading-none">
                    <Contador valor={visitasAgendadas.length} />
                  </p>
                  <p className="text-slate-400 text-xs mt-2">Visitas agendadas</p>
                  {proximaVisita && (
                    <p className="text-cyan-300 text-xs mt-2">
                      Próxima:{" "}
                      {new Date(proximaVisita.data_hora).toLocaleDateString("pt-AO", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  )}
                </div>
              </CartaoBento>
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
                    layoutId="aba-intermediario"
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
            <SkeletonCards />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={aba}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                {/* CASAS */}
                {aba === "casas" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <motion.button
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -6 }}
                      onClick={() => router.push("/publicarCasa")}
                      className="group min-h-80 rounded-3xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white/50 hover:bg-blue-50 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:rotate-90 transition-transform duration-500">
                        <Plus className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-slate-600 font-semibold text-sm">
                        {minhasCasas.length === 0 ? "Publicar a primeira casa" : "Publicar nova casa"}
                      </p>
                    </motion.button>

                    {minhasCasas.map((casa, i) => (
                      <motion.div
                        key={casa.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (i + 1) * 0.05, duration: 0.4 }}
                        whileHover={{ y: -6 }}
                        className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-shadow"
                      >
                        <div className="relative h-56 overflow-hidden bg-linear-to-br from-slate-100 to-slate-200">
                          {casa.imagem_url ? (
                            <Image
                              src={casa.imagem_url}
                              alt={casa.titulo}
                              width={400}
                              height={224}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Home className="w-12 h-12 text-slate-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent" />
                          <span className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-blue-700 font-bold text-sm shadow">
                            {formatarPreco(casa.preco)}
                            <span className="text-slate-400 font-medium text-xs">/mês</span>
                          </span>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-slate-900 text-lg leading-tight mb-4 line-clamp-1">
                            {casa.titulo}
                          </h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push(`/casas/${casa.id}`)}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" /> Ver
                            </button>
                            <button
                              onClick={() => deletarCasa(casa.id)}
                              className="px-3.5 py-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer"
                              aria-label="Deletar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* VISITAS */}
                {aba === "visitas" && (
                  <div>
                    {minhasVisitas.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-4 py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                          <CalendarDays className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-slate-500 text-sm">Ainda não tens visitas agendadas</p>
                      </div>
                    ) : (
                      <div className="relative pl-12">
                        <div className="absolute left-5 top-2 bottom-2 w-px bg-linear-to-b from-blue-500/60 via-slate-200 to-transparent" />
                        <div className="space-y-5">
                          {minhasVisitas.map((visita, i) => {
                            const data = new Date(visita.data_hora)
                            const eProxima = proximaVisita?.id === visita.id
                            return (
                              <motion.div
                                key={visita.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="relative"
                              >
                                <span
                                  className={`absolute -left-[2.125rem] top-8 w-3 h-3 rounded-full ${
                                    eProxima
                                      ? "bg-blue-500 shadow-[0_0_14px_4px_rgba(59,130,246,0.5)]"
                                      : "bg-slate-300"
                                  }`}
                                />
                                <div
                                  className={`rounded-3xl border shadow-sm hover:shadow-lg transition-shadow p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                    eProxima ? "border-blue-300 bg-blue-50/60" : "border-slate-100 bg-white"
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-linear-to-br from-blue-600 to-cyan-500 text-white flex flex-col items-center justify-center shadow-lg shadow-blue-500/25">
                                      <span className="text-2xl font-extrabold leading-none">{data.getDate()}</span>
                                      <span className="text-[10px] uppercase tracking-wider mt-1 opacity-90">
                                        {data.toLocaleDateString("pt-AO", { month: "short" })}
                                      </span>
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-bold text-slate-900">{visita.casas?.titulo || "Casa"}</h3>
                                        {eProxima && (
                                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                                            Próxima
                                          </span>
                                        )}
                                      </div>
                                      <p className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {data.toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" })}
                                      </p>
                                      <span
                                        className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                                          estiloStatus[visita.status] || "bg-slate-100 text-slate-500"
                                        }`}
                                      >
                                        {visita.status}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => cancelarVisita(visita.id)}
                                    className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>
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