import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { casasService } from "../services/casasService"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import CasaCard from "../components/CasaCard"
import FiltrosCasas from "../components/FiltrosCasas"

export default function Casas() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [casas, setCasas] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    const bairroParam = searchParams.get("bairro")
    if (bairroParam) {
      aplicarFiltros({ bairro: bairroParam, tipo: "", preco_max: "" })
    } else {
      carregarCasas()
    }
  }, [])

  const carregarCasas = async () => {
    try {
      setLoading(true)
      const dados = await casasService.listarCasas()
      setCasas(dados)
    } catch (err) {
      setErro("Erro ao carregar casas")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const aplicarFiltros = async ({ bairro, tipo, preco_max }) => {
    try {
      setLoading(true)
      setErro("")

      // Se não há filtros, carrega tudo
      if (!bairro && !tipo && !preco_max) {
        const dados = await casasService.listarCasas()
        setCasas(dados)
        return
      }

      const filtros = {}
      if (bairro) filtros.cidade = bairro  // campo cidade no serviço usa ilike no bairro
      if (tipo) filtros.tipo = tipo
      if (preco_max) filtros.preco_max = parseFloat(preco_max)

      // Filtra localmente para garantir que funciona com bairro
      const todas = await casasService.listarCasas()
      const filtradas = todas.filter((casa) => {
        if (bairro && !casa.bairro?.toLowerCase().includes(bairro.toLowerCase())) return false
        if (tipo && casa.tipo !== tipo) return false
        if (preco_max && casa.preco > parseFloat(preco_max)) return false
        return true
      })
      setCasas(filtradas)
    } catch (err) {
      setErro("Erro ao filtrar casas")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-linear-to-r from-blue-900 to-blue-700 pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-2">Casas Disponíveis</h1>
            <p className="text-blue-200">Encontra a casa perfeita para ti em Luanda</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <FiltrosCasas onFiltrar={aplicarFiltros} />

          <div className="mt-6">
            {erro && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{erro}</div>
            )}

            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-xl text-gray-600">Carregando casas...</div>
              </div>
            ) : casas.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-gray-600">Nenhuma casa encontrada</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {casas.map((casa) => (
                  <CasaCard
                    key={casa.id}
                    {...casa}
                    onClick={() => navigate(`/casas/${casa.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}