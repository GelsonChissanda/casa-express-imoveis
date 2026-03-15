"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { casasService } from "../../../services/casasService";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function CasaDetalhe() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [casa, setCasa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarCasa();
  }, [id]);

  const carregarCasa = async () => {
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
  };

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

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={() => router.push("/casas")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar
          </button>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {casa.imagem_url && (
              <div className="w-full h-96 overflow-hidden">
                <img
                  src={casa.imagem_url}
                  alt={casa.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {casa.titulo}
                </h1>
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
                  <p className="text-xl font-bold text-gray-800">
                    {casa.quartos}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Casas de Banho</p>
                  <p className="text-xl font-bold text-gray-800">
                    {casa.banheiros}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Bairro</p>
                  <p className="text-xl font-bold text-gray-800">
                    {casa.bairro}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Localização
                </h2>
                <p className="text-gray-600">{casa.endereco}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Descrição
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {casa.descricao}
                </p>
              </div>

              <button
                onClick={() => {
                  if (!user) {
                    router.push("/auth");
                  } else {
                    router.push(`/marcar-visita/${casa.id}`);
                  }
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
