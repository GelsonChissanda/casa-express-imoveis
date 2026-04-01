"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { casasService } from "../../../services/casasService";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Image from "next/image";

export default function CasaDetalhe() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [casa, setCasa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [fotoAtiva, setFotoAtiva] = useState(0);

  const carregarCasa = useCallback(async () => {
    try {
      setLoading(true);
      const dados = await casasService.obterCasa(id);
      setCasa(dados);
    } catch (err) {
      setErro("Casa não encontrada");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregarCasa();
  }, [carregarCasa]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-gray-600">Carregando...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (erro || !casa) {
    return (
      <div>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-red-600 mb-4">{erro}</p>
          <button
            onClick={() => router.push("/casas")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Voltar para casas
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Monta a lista de imagens — usa imagens_urls se existir, senão usa imagem_url
  const imagens = casa.imagens_urls?.length > 0
    ? casa.imagens_urls
    : casa.imagem_url
    ? [casa.imagem_url]
    : [];

  const irParaAnterior = (e) => {
    e.stopPropagation();
    setFotoAtiva((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));
  };

  const irParaProxima = (e) => {
    e.stopPropagation();
    setFotoAtiva((prev) => (prev === imagens.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={() => router.push("/casas")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* CARROSSEL */}
            {imagens.length > 0 && (
              <div className="relative w-full h-96 overflow-hidden bg-gray-100">
                {/* Imagem activa */}
                <Image
                  src={imagens[fotoAtiva]}
                  alt={`${casa.titulo} - foto ${fotoAtiva + 1}`}
                  fill
                  className="object-cover transition-opacity duration-300"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority={fotoAtiva === 0}
                />

                {/* Botões de navegação — só aparecem se houver mais de 1 foto */}
                {imagens.length > 1 && (
                  <>
                    <button
                      onClick={irParaAnterior}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors z-10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={irParaProxima}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors z-10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Indicadores (bolinhas) */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {imagens.map((_, i) => (
                        <button
                          key={i}
                          onClick={(e) => { e.stopPropagation(); setFotoAtiva(i); }}
                          className={`w-2 h-2 rounded-full transition-all ${i === fotoAtiva ? "bg-white w-4" : "bg-white/50"}`}
                        />
                      ))}
                    </div>

                    {/* Contador */}
                    <span className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full z-10">
                      {fotoAtiva + 1} / {imagens.length}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Miniaturas */}
            {imagens.length > 1 && (
              <div className="flex gap-2 px-4 pt-4">
                {imagens.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setFotoAtiva(i)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === fotoAtiva ? "border-blue-600" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <Image
                      src={img}
                      alt={`miniatura ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{casa.titulo}</h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-600">
                    {new Intl.NumberFormat("pt-AO", {
                      style: "currency",
                      currency: "AOA",
                      minimumFractionDigits: 0,
                    }).format(casa.preco)}
                  </span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b">
                <div>
                  <p className="text-gray-600 text-sm">Tipologia</p>
                  <p className="text-xl font-bold text-gray-800">{casa.tipo}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Quartos</p>
                  <p className="text-xl font-bold text-gray-800">{casa.quartos}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Casas de Banho</p>
                  <p className="text-xl font-bold text-gray-800">{casa.banheiros}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Bairro</p>
                  <p className="text-xl font-bold text-gray-800">{casa.bairro}</p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Localização</h2>
                <p className="text-gray-600">{casa.endereco}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Descrição</h2>
                <p className="text-gray-600 leading-relaxed">{casa.descricao}</p>
              </div>

              <button
                onClick={() => {
                  if (!user) router.push("/auth");
                  else router.push(`/marcar-visita/${casa.id}`);
                }}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Marcar Visita
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}