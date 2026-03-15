import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { casasService } from "../services/casasService"
import { visitasService } from "../services/visitasService"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout, loading: authLoading } = useAuth()

  const [minhasCasas, setMinhasCasas] = useState([])
  const [minhasVisitas, setMinhasVisitas] = useState([])
  const [loading, setLoading] = useState(false)
  const [aba, setAba] = useState("casas")

  const nomeUtilizador = user?.user_metadata?.nome || user?.email

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth")
    if (user) carregarDados()
  }, [user, authLoading])

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
      try { await casasService.deletarCasa(id); carregarDados() }
      catch { alert("Erro ao deletar casa") }
    }
  }

  const cancelarVisita = async (id) => {
    if (confirm("Tem a certeza que queres cancelar esta visita?")) {
      try { await visitasService.cancelarVisita(id); carregarDados() }
      catch { alert("Erro ao cancelar visita") }
    }
  }

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">A verificar sessão...</p>
    </div>
  )

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Bem-vindo, {nomeUtilizador}!</h1>
                <p className="text-blue-200">Gerir as tuas casas e visitas</p>
              </div>
              <button onClick={() => logout().then(() => navigate("/"))} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Sair</button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button onClick={() => setAba("casas")} className={`pb-4 font-semibold ${aba === "casas" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}>Minhas Casas</button>
            <button onClick={() => setAba("visitas")} className={`pb-4 font-semibold ${aba === "visitas" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}>Minhas Visitas</button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]"><p className="text-xl text-gray-600">Carregando...</p></div>
          ) : aba === "casas" ? (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Minhas Casas ({minhasCasas.length})</h2>
                <button onClick={() => navigate("/publicar-casa")} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Publicar Nova Casa</button>
              </div>
              {minhasCasas.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg">
                  <p className="text-gray-600 mb-4">Ainda não publicaste nenhuma casa</p>
                  <button onClick={() => navigate("/publicar-casa")} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Publicar Primeira Casa</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {minhasCasas.map((casa) => (
                    <div key={casa.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                      {casa.imagem_url && <img src={casa.imagem_url} alt={casa.titulo} className="w-full h-48 object-cover" />}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 mb-2">{casa.titulo}</h3>
                        <p className="text-blue-600 font-bold mb-3">{new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", minimumFractionDigits: 0 }).format(casa.preco)}/mês</p>
                        <div className="flex gap-2">
                          <button onClick={() => navigate(`/casas/${casa.id}`)} className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm">Ver</button>
                          <button onClick={() => deletarCasa(casa.id)} className="flex-1 px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm">Deletar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Minhas Visitas ({minhasVisitas.length})</h2>
              {minhasVisitas.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg">
                  <p className="text-gray-600">Ainda não marcaste nenhuma visita</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {minhasVisitas.map((visita) => (
                    <div key={visita.id} className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-gray-800 mb-2">{visita.casas?.titulo || "Casa"}</h3>
                        <p className="text-gray-600 text-sm mb-1">Data: {new Date(visita.data_hora).toLocaleDateString("pt-AO")}</p>
                        <p className="text-gray-600 text-sm">Hora: {new Date(visita.data_hora).toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" })}</p>
                        <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${visita.status === "agendada" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>{visita.status}</span>
                      </div>
                      <button onClick={() => cancelarVisita(visita.id)} className="px-6 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200">Cancelar</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}