"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, animate } from "framer-motion"
import {
  Search,
  Heart,
  MapPin,
  Building2,
  CalendarCheck,
  CalendarDays,
  LogOut,
  ArrowRight,
  MessageCircle,
  Clock,
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

function EstadoVazio({ icone: Icone, texto, onClick, botao }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-4 py-16 bg-white rounded-3xl border border-dashed border-slate-200"
    >
      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
        <Icone className="w-8 h-8 text-blue-600" />
      </div>
      <p className="text-slate-500 text-sm">{texto}</p>
      {onClick && (
        <button
          onClick={onClick}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
        >
          {botao}
        </button>
      )}
    </motion.div>
  )
}

function CasaCard({ casa, favorito, onFavorito, onDetalhes, onContactar, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
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

        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => onFavorito(casa.id)}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/40 transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${favorito ? "fill-rose-500 text-rose-500" : "text-white"}`}
          />
        </motion.button>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-blue-700 font-bold text-sm shadow">
            {formatarPreco(casa.preco)}
            <span className="text-slate-400 font-medium text-xs">/mês</span>
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 line-clamp-1">
          {casa.titulo}
        </h3>
        {casa.localizacao && (
          <p className="flex items-center gap-1 text-slate-400 text-xs mb-4">
            <MapPin className="w-3.5 h-3.5" /> {casa.localizacao}
          </p>
        )}
        <div className="flex gap-2">
          <button
            onClick={onDetalhes}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Ver Detalhes <ArrowRight className="w-4 h-4" />
          </button>
          {onContactar && (
            <button
              onClick={onContactar}
              className="px-3.5 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
              aria-label="Contactar"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
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

export default function DashboardCliente() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const [todasCasas, setTodasCasas] = useState([])
  const [minhasVisitas, setMinhasVisitas] = useState([])
  const [favoritos, setFavoritos] = useState([])
  const [loading, setLoading] = useState(false)
  const [aba, setAba] = useState("casas")
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
    const favGuardados = JSON.parse(localStorage.getItem(`favoritos_${user?.id}`) || "[]")
    setFavoritos(favGuardados)
  }, []) // eslint-disable-line

  const carregarDados = async () => {
    try {
      setLoading(true)
      const casas = await casasService.listarCasas()
      setTodasCasas(casas)
      const visitas = await visitasService.obterMinhasVisitas(user.id)
      setMinhasVisitas(visitas)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorito = (casaId) => {
    const novos = favoritos.includes(casaId)
      ? favoritos.filter((id) => id !== casaId)
      : [...favoritos, casaId]
    setFavoritos(novos)
    localStorage.setItem(`favoritos_${user?.id}`, JSON.stringify(novos))
  }

  const cancelarVisita = async (id) => {
    if (confirm("Tens a certeza que queres cancelar esta visita?")) {
      try {
        await visitasService.cancelarVisita(id)
        carregarDados()
      } catch {
        alert("Erro ao cancelar visita")
      }
    }
  }

  const casasFiltradas = todasCasas.filter(
    (c) =>
      c.titulo?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      c.localizacao?.toLowerCase().includes(pesquisa.toLowerCase())
  )
  const casasFavoritas = todasCasas.filter((c) => favoritos.includes(c.id))

  const abas = [
    { id: "casas", label: "Casas", icone: Building2 },
    { id: "visitas", label: `Visitas (${minhasVisitas.length})`, icone: CalendarDays },
    { id: "favoritos", label: `Favoritos (${favoritos.length})`, icone: Heart },
  ]

  const stats = [
    { label: "Casas Disponíveis", valor: todasCasas.length, icone: Building2 },
    {
      label: "Visitas Agendadas",
      valor: minhasVisitas.filter((v) => v.status === "agendada").length,
      icone: CalendarCheck,
    },
    { label: "Favoritos", valor: favoritos.length, icone: Heart },
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
                  <p className="text-cyan-300 text-xs font-semibold uppercase tracking-[0.2em] mb-1">
                    Painel do Cliente
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                    <span className="bg-linear-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                      {primeiroNome}
                    </span>
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">Encontra a tua próxima casa em Angola</p>
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="flex items-center gap-4 bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-5"
                >
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <s.icone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-white leading-none">
                      <Contador valor={s.valor} />
                    </p>
                    <p className="text-slate-400 text-xs mt-1.5">{s.label}</p>
                  </div>
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
                    layoutId="aba-ativa"
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
                  <div>
                    <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                      <h2 className="text-2xl font-extrabold text-slate-900">Casas Disponíveis</h2>
                      <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Pesquisar por nome ou localização..."
                          value={pesquisa}
                          onChange={(e) => setPesquisa(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    {casasFiltradas.length === 0 ? (
                      <EstadoVazio icone={Search} texto="Nenhuma casa encontrada" />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {casasFiltradas.map((casa, i) => (
                          <CasaCard
                            key={casa.id}
                            casa={casa}
                            index={i}
                            favorito={favoritos.includes(casa.id)}
                            onFavorito={toggleFavorito}
                            onDetalhes={() => router.push(`/casas/${casa.id}`)}
                            onContactar={() => router.push(`/casas/${casa.id}#contacto`)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* VISITAS */}
                {aba === "visitas" && (
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-8">As Minhas Visitas</h2>
                    {minhasVisitas.length === 0 ? (
                      <EstadoVazio
                        icone={CalendarDays}
                        texto="Ainda não tens visitas agendadas"
                        botao="Explorar Casas"
                        onClick={() => setAba("casas")}
                      />
                    ) : (
                      <div className="space-y-4">
                        {minhasVisitas.map((visita, i) => {
                          const data = new Date(visita.data_hora)
                          return (
                            <motion.div
                              key={visita.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.06 }}
                              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="flex gap-4 items-center">
                                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-cyan-500 text-white flex flex-col items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                                  <span className="text-2xl font-extrabold leading-none">{data.getDate()}</span>
                                  <span className="text-[10px] uppercase tracking-wider mt-1 opacity-90">
                                    {data.toLocaleDateString("pt-AO", { month: "short" })}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="font-bold text-slate-900">{visita.casas?.titulo || "Casa"}</h3>
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
                              <div className="flex gap-2">
                                <button
                                  onClick={() => router.push(`/casas/${visita.casa_id}`)}
                                  className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
                                >
                                  Ver Casa
                                </button>
                                <button
                                  onClick={() => cancelarVisita(visita.id)}
                                  className="px-4 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* FAVORITOS */}
                {aba === "favoritos" && (
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-8">Os Meus Favoritos</h2>
                    {casasFavoritas.length === 0 ? (
                      <EstadoVazio
                        icone={Heart}
                        texto="Ainda não guardaste nenhum favorito"
                        botao="Explorar Casas"
                        onClick={() => setAba("casas")}
                      />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {casasFavoritas.map((casa, i) => (
                          <CasaCard
                            key={casa.id}
                            casa={casa}
                            index={i}
                            favorito
                            onFavorito={toggleFavorito}
                            onDetalhes={() => router.push(`/casas/${casa.id}`)}
                          />
                        ))}
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