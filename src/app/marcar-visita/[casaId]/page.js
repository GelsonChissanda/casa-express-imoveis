"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "../../../contexts/AuthContext"
import { casasService } from "../../../services/casasService"
import { visitasService } from "../../../services/visitasService"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"

export default function MarcarVisita() {
  const { casaId } = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const [casa, setCasa] = useState(null)
  const [data, setData] = useState("")
  const [hora, setHora] = useState("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    const carregarCasa = async () => {
      try {
        const dados = await casasService.obterCasa(casaId)
        setCasa(dados)
      } catch (err) {
        setErro("Casa não encontrada")
        console.error(err)
      }
    }
    carregarCasa()
  }, [casaId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro("")
    setLoading(true)

    try {
      if (!data || !hora) {
        setErro("Preenche data e hora")
        return
      }

      const dataHora = new Date(`${data}T${hora}`)
      if (dataHora < new Date()) {
        setErro("Seleciona uma data e hora futuras")
        return
      }

      await visitasService.marcarVisita({
        usuario_id: user.id,
        casa_id: casaId,
        data_hora: dataHora.toISOString(),
        status: "agendada",
      })

      setSucesso(true)
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (err) {
      setErro(err.message || "Erro ao marcar visita")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (sucesso) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Visita Marcada!</h2>
            <p className="text-gray-600">A tua visita foi marcada com sucesso. Podes acompanhar no dashboard.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => router.push(`/casas/${casaId}`)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Marcar Visita</h1>
            <p className="text-gray-600 mb-8">{casa?.titulo}</p>

            {erro && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{erro}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data <span className="text-red-500">*</span>
                </label>
                <input type="date" value={data} onChange={(e) => setData(e.target.value)} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hora <span className="text-red-500">*</span>
                </label>
                <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                {loading ? "Marcando..." : "Marcar Visita"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}