import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { casasService } from "../services/casasService"
import { supabase } from "../lib/supabaseClient"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const bairrosLuanda = [
  "Talatona", "Kilamba Kiaxi", "Luanda", "Viana", "Cazenga",
  "Quimper", "Rangel", "Benilson", "Caála", "Camama",
  "Zango", "Maianga", "Alvalade", "Praia do Bispo", "Conguém", "Morro Bento",
]

export default function PublicarCasa() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    titulo: "", descricao: "", preco: "", bairro: "",
    quartos: "", casasDeBanho: "", tipo: "",
  })

  const [fotoNome, setFotoNome] = useState("")
  const [fotoFile, setFotoFile] = useState(null)
  const [erros, setErros] = useState({})
  const [submetido, setSubmetido] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  const atualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: "" }))
  }

  const validar = () => {
    const e = {}
    if (!form.titulo.trim()) e.titulo = "Título obrigatório"
    if (!form.descricao.trim()) e.descricao = "Descrição obrigatória"
    else if (form.descricao.trim().length < 30) e.descricao = "Descrição muito curta (mín. 30 caracteres)"
    if (!form.preco) e.preco = "Preço obrigatório"
    else if (Number(form.preco) <= 0) e.preco = "Preço inválido"
    if (!form.bairro) e.bairro = "Bairro obrigatório"
    if (!form.quartos) e.quartos = "Obrigatório"
    if (!form.casasDeBanho) e.casasDeBanho = "Obrigatório"
    if (!form.tipo) e.tipo = "Tipologia obrigatória"
    return e
  }

  const handleSubmit = async () => {
    const e = validar()
    if (Object.keys(e).length > 0) { setErros(e); return }

    setLoading(true)
    setErro("")

    try {
      let imagem_url = ""

      if (fotoFile) {
        // Remove caracteres inválidos do nome do ficheiro
        const nomeLimpo = fotoFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")
        const nomeArquivo = `${Date.now()}-${nomeLimpo}`

        const { error: uploadError } = await supabase.storage
          .from("casas-fotos")
          .upload(nomeArquivo, fotoFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from("casas-fotos")
          .getPublicUrl(nomeArquivo)

        imagem_url = publicUrl
      }

      const casa = {
        usuario_id: user.id,
        titulo: form.titulo,
        descricao: form.descricao,
        preco: parseFloat(form.preco),
        bairro: form.bairro,
        quartos: parseInt(form.quartos),
        banheiros: parseInt(form.casasDeBanho),
        tipo: form.tipo,
        imagem_url,
        created_at: new Date(),
      }

      await casasService.criarCasa(casa)
      setSubmetido(true)
    } catch (err) {
      setErro(err.message || "Erro ao publicar casa")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (submetido) {
    return (
      <div className="min-h-screen bg-[#F7F8FC]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-3">Casa publicada!</h2>
            <p className="text-gray-500 text-sm mb-7">
              O teu anúncio "<strong>{form.titulo}</strong>" foi publicado com sucesso e já está visível para os clientes.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate("/dashboard")}
                className="w-full py-3 bg-blue-800 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors">
                Ver no Dashboard
              </button>
              <button onClick={() => { setSubmetido(false); setForm({ titulo: "", descricao: "", preco: "", bairro: "", quartos: "", casasDeBanho: "", tipo: "" }); setFotoNome(""); setFotoFile(null); }}
                className="w-full py-3 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors">
                Publicar outra casa
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Navbar />

      <div className="bg-gradient-to-r from-blue-900 to-blue-700 pt-24 pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <button onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">Publicar nova casa</h1>
          <p className="text-blue-200 text-sm">Preenche os detalhes da casa para publicar o anúncio</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {erro && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{erro}</div>
        )}

        <div className="space-y-5">
          {/* Upload de foto */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-black flex items-center justify-center">1</span>
              Foto da casa
            </h2>
            <div onClick={() => document.getElementById("upload-foto").click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors group">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                <svg className="w-7 h-7 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {fotoNome ? (
                <p className="text-blue-700 font-semibold text-sm">{fotoNome}</p>
              ) : (
                <>
                  <p className="text-gray-600 font-semibold text-sm mb-1">Clica para selecionar uma foto</p>
                  <p className="text-gray-400 text-xs">JPG, PNG ou WEBP até 5MB</p>
                </>
              )}
            </div>
            <input id="upload-foto" type="file" accept="image/*" className="hidden"
              onChange={(e) => { if (e.target.files[0]) { setFotoNome(e.target.files[0].name); setFotoFile(e.target.files[0]) } }} />
          </div>

          {/* Informações básicas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-black flex items-center justify-center">2</span>
              Informações básicas
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Título do anúncio <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Ex: Apartamento T3 moderno em Talatona com varanda"
                  value={form.titulo} onChange={(e) => atualizar("titulo", e.target.value)}
                  className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${erros.titulo ? "border-red-400" : "border-gray-200"}`} />
                {erros.titulo && <p className="text-red-500 text-xs mt-1">{erros.titulo}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Descrição <span className="text-red-500">*</span></label>
                <textarea placeholder="Descreve a casa em detalhe..." value={form.descricao}
                  onChange={(e) => atualizar("descricao", e.target.value)} rows={4}
                  className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none ${erros.descricao ? "border-red-400" : "border-gray-200"}`} />
                <div className="flex justify-between mt-1">
                  {erros.descricao ? <p className="text-red-500 text-xs">{erros.descricao}</p> : <span />}
                  <span className="text-xs text-gray-400">{form.descricao.length} caracteres</span>
                </div>
              </div>
            </div>
          </div>

          {/* Localização e preço */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-black flex items-center justify-center">3</span>
              Localização e preço
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bairro <span className="text-red-500">*</span></label>
                <select value={form.bairro} onChange={(e) => atualizar("bairro", e.target.value)}
                  className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${erros.bairro ? "border-red-400" : "border-gray-200"}`}>
                  <option value="">Seleccionar bairro</option>
                  {bairrosLuanda.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {erros.bairro && <p className="text-red-500 text-xs mt-1">{erros.bairro}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Preço mensal (Kz) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="number" placeholder="Ex: 150000" value={form.preco}
                    onChange={(e) => atualizar("preco", e.target.value)}
                    className={`w-full pl-3 pr-10 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${erros.preco ? "border-red-400" : "border-gray-200"}`} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">Kz</span>
                </div>
                {erros.preco && <p className="text-red-500 text-xs mt-1">{erros.preco}</p>}
                {form.preco && !erros.preco && (
                  <p className="text-xs text-blue-600 mt-1 font-medium">{new Intl.NumberFormat("pt-AO").format(form.preco)} Kz/mês</p>
                )}
              </div>
            </div>
          </div>

          {/* Características */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-black flex items-center justify-center">4</span>
              Características
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tipologia <span className="text-red-500">*</span></label>
                <select value={form.tipo} onChange={(e) => atualizar("tipo", e.target.value)}
                  className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${erros.tipo ? "border-red-400" : "border-gray-200"}`}>
                  <option value="">Tipo</option>
                  <option value="T1">T1</option>
                  <option value="T2">T2</option>
                  <option value="T3">T3</option>
                  <option value="T4+">T4+</option>
                </select>
                {erros.tipo && <p className="text-red-500 text-xs mt-1">{erros.tipo}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Quartos <span className="text-red-500">*</span></label>
                <select value={form.quartos} onChange={(e) => atualizar("quartos", e.target.value)}
                  className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${erros.quartos ? "border-red-400" : "border-gray-200"}`}>
                  <option value="">Nº quartos</option>
                  {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} quarto{n !== 1 ? "s" : ""}</option>)}
                </select>
                {erros.quartos && <p className="text-red-500 text-xs mt-1">{erros.quartos}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Casas de banho <span className="text-red-500">*</span></label>
                <select value={form.casasDeBanho} onChange={(e) => atualizar("casasDeBanho", e.target.value)}
                  className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${erros.casasDeBanho ? "border-red-400" : "border-gray-200"}`}>
                  <option value="">Nº WC</option>
                  {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} WC</option>)}
                </select>
                {erros.casasDeBanho && <p className="text-red-500 text-xs mt-1">{erros.casasDeBanho}</p>}
              </div>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4 bg-blue-800 text-white font-bold text-base rounded-xl hover:bg-blue-700 active:bg-blue-900 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {loading ? "Publicando..." : "Publicar anúncio"}
          </button>

          <p className="text-center text-xs text-gray-400">
            Ao publicar, confirmas que as informações são verdadeiras e aceitas os{" "}
            <span className="text-blue-600 cursor-pointer">Termos da Plataforma</span>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}