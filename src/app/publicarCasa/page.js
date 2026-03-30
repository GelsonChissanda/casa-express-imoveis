"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { casasService } from "../../services/casasService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";




const selecionarBairro = (bairro) => {
  atualizar("bairro", bairro)
  setBairroValido(true)
  setMostrarSugestoes(false)
  setSugestoes([])
}

const CLOUD_NAME = "dw8t6gigw";
const UPLOAD_PRESET = "casas-fotos";

const bairrosLuanda = [
  "Talatona",
  "Kilamba Kiaxi",
  "Luanda",
  "Viana",
  "Cazenga",
  "Rangel",
  "Camama",
  "Camama 1",
  "Zango 1",
  "Zango 2",
  "Zango 3",
  "Zango 4",
  "Maianga",
  "Alvalade",
  "Praia do Bispo",
  "Morro Bento",
  "Miramar",
  "Ingombota",
  "Sambizanga",
  "Cacuaco",
  "Belas",
  "Samba",
  "Benfica",
  "Rocha Pinto",
  "Calemba 2",
  "Vila Alice",
  "Palanca",
  "Golfe 1",
  "Golfe 2",
  "Mutamba",
  "Cidade Alta",
  "Largo da Kinaxixi",
  "São Paulo",
  "Marçal",
  "Quinaxixe",
  "Cassenda",
  "Petrangol",
  "Catambor",
  "Ilha de Luanda",
  "Chicala",
  "Maculusso",
  "Patrice Lumumba",
  "Terra Nova",
  "Hoji Ya Henda",
  "Caála",
  "Quimper",
  "Benilson",
  "Conguém",
  "Gamek",
  "Cidade do Kilamba",
  "Sequele",
  "Panguila",
  "Mulenvos",
].sort((a, b) => a.localeCompare(b, "pt"));

export default function PublicarCasa() {
const [sugestoes, setSugestoes] = useState([])
const [mostrarSugestoes, setMostrarSugestoes] = useState(false)
const [bairroValido, setBairroValido] = useState(false)

const handleBairroChange = (valor) => {
  atualizar("bairro", valor)
  setBairroValido(false)
  if (valor.length > 0) {
    const filtradas = bairrosLuanda.filter(b =>
      b.toLowerCase().includes(valor.toLowerCase())
    )
    setSugestoes(filtradas)
    setMostrarSugestoes(true)
  } else {
    setSugestoes([])
    setMostrarSugestoes(false)
  }
}


  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    preco: "",
    bairro: "",
    quartos: "",
    casasDeBanho: "",
    tipo: "",
    whatsapp: "",
  });

  const [fotos, setFotos] = useState([]);
  const [erros, setErros] = useState({});
  const [submetido, setSubmetido] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const atualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: "" }));
  };

  const adicionarFotos = (e) => {
    const files = Array.from(e.target.files);
    const novas = files.slice(0, 4 - fotos.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFotos((prev) => [...prev, ...novas].slice(0, 4));
  };

  const removerFoto = (index) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };

  const validar = () => {
    const e = {};
    if (!form.titulo.trim()) e.titulo = "Título obrigatório";
    if (!form.descricao.trim()) e.descricao = "Descrição obrigatória";
    else if (form.descricao.trim().length < 30)
      e.descricao = "Descrição muito curta (mín. 30 caracteres)";
    if (!form.preco) e.preco = "Preço obrigatório";
    else if (Number(form.preco) <= 0) e.preco = "Preço inválido";
    if (!form.bairro || !bairroValido) e.bairro = "Selecciona um bairro da lista"
    if (!form.quartos) e.quartos = "Obrigatório";
    if (!form.casasDeBanho) e.casasDeBanho = "Obrigatório";
    if (!form.tipo) e.tipo = "Tipologia obrigatória";
    if (!form.whatsapp.trim()) e.whatsapp = "WhatsApp obrigatório";
    else if (!/^\d{9,15}$/.test(form.whatsapp.replace(/\s/g, "")))
      e.whatsapp = "Número inválido (só dígitos, 9-15)";
    return e;
  };

  // ✅ Upload para o Cloudinary
  const uploadParaCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );
    const data = await res.json();
    if (!data.secure_url) throw new Error("Erro no upload da imagem");
    return data.secure_url;
  };

  const handleSubmit = async () => {
    const e = validar();
    if (Object.keys(e).length > 0) {
      setErros(e);
      return;
    }

    setLoading(true);
    setErro("");

    try {
      // ✅ Faz upload de todas as fotos para o Cloudinary
      const imagens_urls = [];
      for (const foto of fotos) {
        const url = await uploadParaCloudinary(foto.file);
        imagens_urls.push(url);
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
        whatsapp: form.whatsapp.replace(/\s/g, ""),
        imagem_url: imagens_urls[0] || "",
        imagens_urls,
        created_at: new Date(),
      };

      await casasService.criarCasa(casa);
      setSubmetido(true);
    } catch (err) {
      setErro(err.message || "Erro ao publicar casa");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submetido) {
    return (
      <div className="min-h-screen bg-[#F7F8FC]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-3">
              Casa publicada!
            </h2>
            <p className="text-gray-500 text-sm mb-7">
              O teu anúncio &quot;<strong>{form.titulo}</strong>&quot; foi
              publicado com sucesso.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3 bg-blue-800 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors"
              >
                Ver no Dashboard
              </button>
              <button
                onClick={() => {
                  setSubmetido(false);
                  setForm({
                    titulo: "",
                    descricao: "",
                    preco: "",
                    bairro: "",
                    quartos: "",
                    casasDeBanho: "",
                    tipo: "",
                    whatsapp: "",
                  });
                  setFotos([]);
                }}
                className="w-full py-3 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors"
              >
                Publicar outra casa
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Navbar />

      <div className="bg-linear-to-r from-blue-900 to-blue-700 pt-24 pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-4 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar ao Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            Publicar nova casa
          </h1>
          <p className="text-blue-200 text-sm">
            Preenche os detalhes da casa para publicar o anúncio
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {erro && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {erro}
          </div>
        )}

        <div className="space-y-5">
          {/* SECÇÃO 1: Fotos */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-black flex items-center justify-center">
                1
              </span>
              Fotos da casa{" "}
              <span className="text-gray-400 text-xs font-normal ml-1">
                ({fotos.length}/4)
              </span>
            </h2>

            {fotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {fotos.map((foto, i) => (
                  <div
                    key={i}
                    className="relative rounded-xl overflow-hidden aspect-square"
                  >
                    <Image
                      src={foto.preview}
                      alt={`Foto ${i + 1}`}
                      className="w-full h-full object-cover"
                      width={200}
                      height={200}
                    />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        Principal
                      </span>
                    )}
                    <button
                      onClick={() => removerFoto(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {fotos.length < 4 && (
              <div
                onClick={() => document.getElementById("upload-fotos").click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors group"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                  <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 font-semibold text-sm mb-1">
                  {fotos.length === 0
                    ? "Adicionar fotos"
                    : "Adicionar mais fotos"}
                </p>
                <p className="text-gray-400 text-xs">
                  Até {4 - fotos.length} foto{4 - fotos.length !== 1 ? "s" : ""}{" "}
                  • JPG, PNG ou WEBP
                </p>
              </div>
            )}

            <input
              id="upload-fotos"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={adicionarFotos}
            />
          </div>

          {/* SECÇÃO 2: Informações básicas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-black flex items-center justify-center">
                2
              </span>
              Informações básicas
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Título do anúncio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Apartamento T3 moderno em Talatona com varanda"
                  value={form.titulo}
                  onChange={(e) => atualizar("titulo", e.target.value)}
                  className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${erros.titulo ? "border-red-400" : "border-gray-200"}`}
                />
                {erros.titulo && (
                  <p className="text-red-500 text-xs mt-1">{erros.titulo}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Descrição <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Descreve a casa em detalhe..."
                  value={form.descricao}
                  onChange={(e) => atualizar("descricao", e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none ${erros.descricao ? "border-red-400" : "border-gray-200"}`}
                />
                <div className="flex justify-between mt-1">
                  {erros.descricao ? (
                    <p className="text-red-500 text-xs">{erros.descricao}</p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-gray-400">
                    {form.descricao.length} caracteres
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECÇÃO 3: Localização e contacto */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-black flex items-center justify-center">
                3
              </span>
              Localização e contacto
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Bairro <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Escolhe um bairro de Luanda"
                  value={form.bairro}
                  onChange={(e) => handleBairroChange(e.target.value)}
                  className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${erros.bairro ? "border-red-400" : "border-gray-200"}`}
                />


{mostrarSugestoes && sugestoes.length > 0 && (
  <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto">
    {sugestoes.map((b) => (
      <button key={b} type="button"
        onClick={() => selecionarBairro(b)}
        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-50 last:border-0">
        {b}
      </button>
    ))}
  </div>
)}


                {erros.bairro && (
                  <p className="text-red-500 text-xs mt-1">{erros.bairro}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Preço mensal (Kz) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Ex: 150000"
                    value={form.preco}
                    onChange={(e) => atualizar("preco", e.target.value)}
                    className={`w-full pl-3 pr-10 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${erros.preco ? "border-red-400" : "border-gray-200"}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">
                    Kz
                  </span>
                </div>
                {erros.preco && (
                  <p className="text-red-500 text-xs mt-1">{erros.preco}</p>
                )}
                {form.preco && !erros.preco && (
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    {new Intl.NumberFormat("pt-AO").format(form.preco)} Kz/mês
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  WhatsApp do proprietário{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    🇦🇴 +244
                  </span>
                  <input
                    type="tel"
                    placeholder="923 456 789"
                    value={form.whatsapp}
                    onChange={(e) => atualizar("whatsapp", e.target.value)}
                    className={`w-full pl-20 pr-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${erros.whatsapp ? "border-red-400" : "border-gray-200"}`}
                  />
                </div>
                {erros.whatsapp && (
                  <p className="text-red-500 text-xs mt-1">{erros.whatsapp}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Os clientes usarão este número para te contactar via WhatsApp
                </p>
              </div>
            </div>
          </div>

          {/* SECÇÃO 4: Características */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-black flex items-center justify-center">
                4
              </span>
              Características
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Tipologia <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.tipo}
                  onChange={(e) => atualizar("tipo", e.target.value)}
                  className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${erros.tipo ? "border-red-400" : "border-gray-200"}`}
                >
                  <option value="">Tipo</option>
                  <option value="T1">T1</option>
                  <option value="T2">T2</option>
                  <option value="T3">T3</option>
                  <option value="T4+">T4+</option>
                </select>
                {erros.tipo && (
                  <p className="text-red-500 text-xs mt-1">{erros.tipo}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Quartos <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.quartos}
                  onChange={(e) => atualizar("quartos", e.target.value)}
                  className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${erros.quartos ? "border-red-400" : "border-gray-200"}`}
                >
                  <option value="">Nº quartos</option>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} quarto{n !== 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                {erros.quartos && (
                  <p className="text-red-500 text-xs mt-1">{erros.quartos}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Casas de banho <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.casasDeBanho}
                  onChange={(e) => atualizar("casasDeBanho", e.target.value)}
                  className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${erros.casasDeBanho ? "border-red-400" : "border-gray-200"}`}
                >
                  <option value="">Nº WC</option>
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} WC
                    </option>
                  ))}
                </select>
                {erros.casasDeBanho && (
                  <p className="text-red-500 text-xs mt-1">
                    {erros.casasDeBanho}
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-blue-800 text-white font-bold text-base rounded-xl hover:bg-blue-700 active:bg-blue-900 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {loading ? "Publicando..." : "Publicar anúncio"}
          </button>

          <p className="text-center text-xs text-gray-400">
            Ao publicar, confirmas que as informações são verdadeiras e aceitas
            os{" "}
            <span className="text-blue-600 cursor-pointer">
              Termos da Plataforma
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
