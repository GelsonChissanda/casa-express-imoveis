"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import { casasService } from "../../services/casasService"
import { visitasService } from "../../services/visitasService"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function DashboardCliente() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const [todasCasas, setTodasCasas] = useState([])
  const [minhasVisitas, setMinhasVisitas] = useState([])
  const [favoritos, setFavoritos] = useState([])
  const [loading, setLoading] = useState(false)
  const [aba, setAba] = useState("casas")
  const [pesquisa, setPesquisa] = useState("")

  const nomeUtilizador = user?.user_metadata?.nome || user?.email

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
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const toggleFavorito = (casaId) => {
    const novos = favoritos.includes(casaId)
      ? favoritos.filter(id => id !== casaId)
      : [...favoritos, casaId]
    setFavoritos(novos)
    localStorage.setItem(`favoritos_${user?.id}`, JSON.stringify(novos))
  }

  const cancelarVisita = async (id) => {
    if (confirm("Tens a certeza que queres cancelar esta visita?")) {
      try { await visitasService.cancelarVisita(id); carregarDados() }
      catch { alert("Erro ao cancelar visita") }
    }
  }

  const casasFiltradas = todasCasas.filter(c =>
    c.titulo?.toLowerCase().includes(pesquisa.toLowerCase()) ||
    c.localizacao?.toLowerCase().includes(pesquisa.toLowerCase())
  )
  const casasFavoritas = todasCasas.filter(c => favoritos.includes(c.id))

  const abas = [
    { id: "casas", label: "Casas Disponíveis" },
    { id: "visitas", label: `As Minhas Visitas (${minhasVisitas.length})` },
    { id: "favoritos", label: `Favoritos (${favoritos.length})` },
  ]

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">

        {/* Header */}
        <div className="bg-linear-to-r from-blue-900 to-blue-700 pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">Painel do Cliente</p>
                <h1 className="text-4xl font-bold text-white mb-2">Olá, {nomeUtilizador}!</h1>
                <p className="text-blue-200">Encontra a tua próxima casa em Angola</p>
              </div>
              <button onClick={() => logout().then(() => router.push("/"))} className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition">Sair</button>
            </div>

            {/* Stats rápidos */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { label: "Casas Disponíveis", valor: todasCasas.length },
                { label: "Visitas Agendadas", valor: minhasVisitas.filter(v => v.status === "agendada").length },
                { label: "Favoritos", valor: favoritos.length },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-white">{stat.valor}</p>
                  <p className="text-blue-200 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-200">
            {abas.map((a) => (
              <button key={a.id} onClick={() => setAba(a.id)}
                className={`pb-4 px-2 font-semibold text-sm transition ${aba === a.id ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
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
              {/* ABA: Casas Disponíveis */}
              {aba === "casas" && (
                <div>
                  <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Casas Disponíveis</h2>
                    <input
                      type="text"
                      placeholder="Pesquisar por nome ou localização..."
                      value={pesquisa}
                      onChange={e => setPesquisa(e.target.value)}
                      className="w-full sm:w-72 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {casasFiltradas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-40 bg-white rounded-xl border border-gray-100">
                      <p className="text-gray-500">Nenhuma casa encontrada</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {casasFiltradas.map((casa) => (
                        <div key={casa.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group">
                          <div className="relative">
                            {casa.imagem_url && (
                              <Image src={casa.imagem_url} alt={casa.titulo} width={400} height={192} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                            )}
                            <button onClick={() => toggleFavorito(casa.id)}
                              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:scale-110 transition">
                              <span className="text-lg">{favoritos.includes(casa.id) ? "❤️" : "🤍"}</span>
                            </button>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-gray-800 mb-1">{casa.titulo}</h3>
                            {casa.localizacao && <p className="text-gray-400 text-xs mb-2">📍 {casa.localizacao}</p>}
                            <p className="text-blue-600 font-bold mb-3">{new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", minimumFractionDigits: 0 }).format(casa.preco)}/mês</p>
                            <div className="flex gap-2">
                              <button onClick={() => router.push(`/casas/${casa.id}`)} className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Ver Detalhes</button>
                              <button onClick={() => router.push(`/casas/${casa.id}#contacto`)} className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm">Contactar</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ABA: Visitas */}
              {aba === "visitas" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">As Minhas Visitas</h2>
                  {minhasVisitas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-40 bg-white rounded-xl border border-gray-100 gap-3">
                      <p className="text-4xl">🏠</p>
                      <p className="text-gray-500">Ainda não tens visitas agendadas</p>
                      <button onClick={() => setAba("casas")} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Explorar Casas</button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {minhasVisitas.map((visita) => (
                        <div key={visita.id} className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
                          <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">🏠</div>
                            <div>
                              <h3 className="font-bold text-gray-800">{visita.casas?.titulo || "Casa"}</h3>
                              <p className="text-gray-500 text-sm mt-1">
                                📅 {new Date(visita.data_hora).toLocaleDateString("pt-AO")} às {new Date(visita.data_hora).toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                              <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${visita.status === "agendada" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                {visita.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => router.push(`/casas/${visita.casa_id}`)} className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm">Ver Casa</button>
                            <button onClick={() => cancelarVisita(visita.id)} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm">Cancelar</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ABA: Favoritos */}
              {aba === "favoritos" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Os Meus Favoritos</h2>
                  {casasFavoritas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-40 bg-white rounded-xl border border-gray-100 gap-3">
                      <p className="text-4xl">🤍</p>
                      <p className="text-gray-500">Ainda não guardaste nenhum favorito</p>
                      <button onClick={() => setAba("casas")} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Explorar Casas</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {casasFavoritas.map((casa) => (
                        <div key={casa.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                          <div className="relative">
                            {casa.imagem_url && (
                              <Image src={casa.imagem_url} alt={casa.titulo} width={400} height={192} className="w-full h-48 object-cover" />
                            )}
                            <button onClick={() => toggleFavorito(casa.id)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:scale-110 transition">
                              <span className="text-lg">❤️</span>
                            </button>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-gray-800 mb-1">{casa.titulo}</h3>
                            {casa.localizacao && <p className="text-gray-400 text-xs mb-2">📍 {casa.localizacao}</p>}
                            <p className="text-blue-600 font-bold mb-3">{new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", minimumFractionDigits: 0 }).format(casa.preco)}/mês</p>
                            <div className="flex gap-2">
                              <button onClick={() => router.push(`/casas/${casa.id}`)} className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Ver Detalhes</button>
                              <button onClick={() => toggleFavorito(casa.id)} className="px-3 py-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 text-sm">Remover</button>
                            </div>
                          </div>
                        </div>
                      ))}
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