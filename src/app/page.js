"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CasaCard from "@/components/CasaCard";
import AreaCard from "@/components/AreaCard";
import { casasService } from "@/services/casasService";
import { supabase } from "@/lib/supabaseClient";

const gradientes = ["azul", "ciano", "indigo", "royal", "escuro"];

export default function Home() {
  const [pesquisa, setPesquisa] = useState("");
  const [casasDestaque, setCasasDestaque] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const router = useRouter();

  const handleBairroChange = (valor) => {
    setPesquisa(valor);
    if (valor.length > 0) {
      const filtradas = bairros
        .filter((b) => b.nome.toLowerCase().includes(valor.toLowerCase()))
        .map((b) => b.nome);
      setSugestoes(filtradas);
      setMostrarSugestoes(true);
    } else {
      setSugestoes([]);
      setMostrarSugestoes(false);
    }
  };

  useEffect(() => {
    casasService
      .listarCasas()
      .then((casas) => {
        if (casas) setCasasDestaque(casas.slice(0, 6));
      })
      .catch(console.error);

    async function carregarBairros() {
      const { data } = await supabase.from("casas").select("bairro");
      if (!data) return;
      const contagem = {};
      data.forEach((casa) => {
        if (casa.bairro)
          contagem[casa.bairro] = (contagem[casa.bairro] || 0) + 1;
      });
      const bairrosArray = Object.entries(contagem)
        .map(([nome, quantidade], i) => ({
          nome,
          quantidade,
          gradiente: gradientes[i % gradientes.length],
        }))
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 5);
      setBairros(bairrosArray);
    }
    carregarBairros();
  }, []);

  const handlePesquisar = () => {
    if (pesquisa.trim())
      router.push(`/casas?bairro=${encodeURIComponent(pesquisa)}`);
    else router.push("/casas");
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Navbar />

      {/* Hero Section com Vídeo de Fundo */}
      <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden">
        {/* Vídeo de Fundo */}
        <div className="absolute inset-0">
  <video
    autoPlay
    muted
    loop
    playsInline
    preload="metadata"
    poster="/imagem.png"
    className="w-full h-full object-cover"
  >
    <source src="/video.mp4" type="video/mp4" />
  </video>

  <div className="absolute inset-0 bg-black/50" />
</div>

        {/* Conteúdo sobreposto */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/30">
            🏙️ Plataforma nº1 de arrendamento em Luanda
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5 tracking-tight">
            Encontra a tua casa
            <br />
            <span className="text-blue-200">em Luanda</span>
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Milhares de casas para arrendar nos melhores bairros de Luanda.
            Seguro, rápido e gratuito.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Pesquisar por bairro..."
                value={pesquisa}
                onChange={(e) => handleBairroChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
                className="w-full pl-10 pr-4 py-3 bg-white/90 text-gray-800 placeholder-gray-400 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white"
              />

              {mostrarSugestoes && sugestoes.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto top-full left-0">
                  {sugestoes.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => {
                        setPesquisa(b);
                        setMostrarSugestoes(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-50 last:border-0"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handlePesquisar}
              className="px-7 py-3 bg-white text-blue-800 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Pesquisar
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[
              { valor: "120+", label: "Casas Disponíveis" },
              { valor: "45+", label: "Intermediários" },
              { valor: "500+", label: "Visitas Marcadas" },
              { valor: "5", label: "Bairros Principais" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-white">
                  {stat.valor}
                </div>
                <div className="text-blue-200 text-sm mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              Simples e rápido
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              Como funciona
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              Em 3 passos simples encontras e arrendas a tua casa ideal em
              Luanda
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                titulo: "Procura",
                desc: "Pesquisa por bairro, preço ou tipologia. Filtra até encontrares a casa ideal.",
                icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
              },
              {
                step: "02",
                titulo: "Visita",
                desc: "Marca uma visita directamente pela plataforma. O intermediário confirma.",
                icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
              },
              {
                step: "03",
                titulo: "Arrenda",
                desc: "Gosta da casa? Assina o contrato e muda-te para o teu novo lar.",
                icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center p-8 rounded-2xl bg-[#F7F8FC] hover:bg-blue-50 transition-colors group"
              >
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 bg-blue-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-blue-100 text-blue-800 text-xs font-black rounded-full flex items-center justify-center border-2 border-white">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.titulo}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                Selecção do editor
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
                Casas em Destaque
              </h2>
            </div>
            <button
              onClick={() => router.push("/casas")}
              className="hidden sm:flex items-center gap-1 text-blue-700 font-semibold text-sm hover:text-blue-900 transition-colors"
            >
              Ver todas
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {casasDestaque.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">Ainda não há casas publicadas.</p>
              <button
                onClick={() => router.push("/auth")}
                className="mt-4 px-6 py-2 bg-blue-800 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
              >
                Publicar uma casa
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {casasDestaque.map((casa) => (
                <CasaCard key={casa.id} {...casa} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <button
              onClick={() => router.push("/casas")}
              className="px-6 py-3 text-sm font-bold text-blue-800 border-2 border-blue-800 rounded-xl hover:bg-blue-800 hover:text-white transition-colors"
            >
              Ver todas as casas
            </button>
          </div>
        </div>
      </section>

      <section id="bairros" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              Explorar por zona
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              Bairros em Destaque
            </h2>
            <p className="text-gray-500 mt-3">
              Descobre casas nos melhores bairros de Luanda
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {bairros.map((b) => (
              <AreaCard key={b.nome} {...b} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-r from-blue-900 to-blue-700 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-60 h-60 border border-white rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 border border-white rounded-full" />
            </div>
            <div className="relative">
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 border border-white/30">
                Para Intermediários
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Publica as tuas casas
                <br />e alcança mais clientes
              </h2>
              <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
                Junta-te a mais de 45 intermediários que já usam a CasaExpress
                para arrendar as suas casas mais rápido.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => router.push("/auth")}
                  className="px-8 py-4 bg-white text-blue-800 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors shadow-lg cursor-pointer"
                >
                  Criar conta gratuita
                </button>
                <button
                  onClick={() => router.push("/casas")}
                  className="cursor-pointer px-8 py-4 bg-white/10 text-white font-bold text-sm rounded-xl hover:bg-white/20 transition-colors border border-white/30"
                >
                  Ver como funciona
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}