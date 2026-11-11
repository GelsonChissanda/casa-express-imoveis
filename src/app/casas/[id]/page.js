"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Home,
  Building2,
  BedDouble,
  Bath,
  ChevronLeft,
  ChevronRight,
  X,
  Images,
  Expand,
  CalendarCheck,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { casasService } from "../../../services/casasService";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const formatarPreco = (v) =>
  new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(v);

function Fundo({ children, altura = "pb-36" }) {
  return (
    <div className={`relative overflow-hidden bg-slate-950 pt-24 ${altura}`}>
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
      <div className="relative max-w-6xl mx-auto px-4">{children}</div>
    </div>
  );
}

export default function CasaDetalhe() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [casa, setCasa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [lightbox, setLightbox] = useState(false);

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

  // Lista de imagens — usa imagens_urls se existir, senão imagem_url
  const imagens = casa?.imagens_urls?.length > 0
    ? casa.imagens_urls
    : casa?.imagem_url
    ? [casa.imagem_url]
    : [];

  const anterior = () => setFotoAtiva((p) => (p === 0 ? imagens.length - 1 : p - 1));
  const proxima = () => setFotoAtiva((p) => (p === imagens.length - 1 ? 0 : p + 1));

  // Teclado e scroll bloqueado quando o lightbox está aberto
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") setFotoAtiva((p) => (p === 0 ? imagens.length - 1 : p - 1));
      if (e.key === "ArrowRight") setFotoAtiva((p) => (p === imagens.length - 1 ? 0 : p + 1));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, imagens.length]);

  const marcarVisita = () => {
    if (!user) router.push("/auth");
    else router.push(`/marcar-visita/${casa.id}`);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-slate-50">
          <Fundo>
            <div className="h-5 w-24 bg-white/10 rounded animate-pulse mb-8" />
            <div className="h-10 w-2/3 bg-white/10 rounded-xl animate-pulse" />
          </Fundo>
          <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-10">
            <div className="h-105 bg-slate-200 rounded-3xl animate-pulse" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (erro || !casa) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
            <Home className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-slate-600">{erro || "Casa não encontrada"}</p>
          <button
            onClick={() => router.push("/casas")}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Voltar para casas
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const specs = [
    { label: "Tipologia", valor: casa.tipo, icone: Building2 },
    { label: "Quartos", valor: casa.quartos, icone: BedDouble },
    { label: "Casas de Banho", valor: casa.banheiros, icone: Bath },
    { label: "Bairro", valor: casa.bairro, icone: MapPin },
  ];

  const linkMapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [casa.endereco, casa.bairro].filter(Boolean).join(", ")
  )}`;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        {/* TOPO */}
        <Fundo>
          <button
            onClick={() => router.push("/casas")}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar às casas
          </button>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {casa.tipo && (
                <span className="px-3 py-1 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold">
                  {casa.tipo}
                </span>
              )}
              {casa.bairro && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/15 text-slate-200 text-xs font-medium">
                  <MapPin className="w-3 h-3" /> {casa.bairro}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight max-w-3xl">
              {casa.titulo}
            </h1>
          </motion.div>
        </Fundo>

        {/* CORPO */}
        <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-10 pb-32 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* COLUNA ESQUERDA */}
            <div className="lg:col-span-2 space-y-8">
              {/* GALERIA */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-900/10 border border-slate-100 p-3">
                <div className="relative h-80 sm:h-105 rounded-2xl overflow-hidden bg-linear-to-br from-slate-100 to-slate-200">
                  {imagens.length > 0 ? (
                    <>
                      <AnimatePresence initial={false}>
                        <motion.div
                          key={fotoAtiva}
                          initial={{ opacity: 0, scale: 1.04 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          drag={imagens.length > 1 ? "x" : false}
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.2}
                          onDragEnd={(e, info) => {
                            if (info.offset.x > 60) anterior();
                            else if (info.offset.x < -60) proxima();
                          }}
                          onClick={() => setLightbox(true)}
                          className="absolute inset-0 cursor-zoom-in"
                        >
                          <Image
                            src={imagens[fotoAtiva]}
                            alt={`${casa.titulo} - foto ${fotoAtiva + 1}`}
                            fill
                            draggable={false}
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 700px"
                            priority={fotoAtiva === 0}
                          />
                        </motion.div>
                      </AnimatePresence>

                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

                      {imagens.length > 1 && (
                        <>
                          <button
                            onClick={anterior}
                            aria-label="Foto anterior"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/40 transition-colors cursor-pointer z-10"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={proxima}
                            aria-label="Próxima foto"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/40 transition-colors cursor-pointer z-10"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          <span className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold z-10">
                            <Images className="w-3.5 h-3.5" /> {fotoAtiva + 1} / {imagens.length}
                          </span>
                        </>
                      )}

                      <button
                        onClick={() => setLightbox(true)}
                        aria-label="Ver em ecrã inteiro"
                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/40 transition-colors cursor-pointer z-10"
                      >
                        <Expand className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-16 h-16 text-slate-300" />
                    </div>
                  )}
                </div>

                {imagens.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {imagens.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setFotoAtiva(i)}
                        className={`relative w-20 h-16 shrink-0 rounded-xl overflow-hidden transition-all cursor-pointer ${
                          i === fotoAtiva
                            ? "ring-2 ring-blue-600 ring-offset-2"
                            : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image src={img} alt={`miniatura ${i + 1}`} fill className="object-cover" sizes="80px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ESPECIFICAÇÕES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {specs.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25 mb-3">
                      <s.icone className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-slate-400 text-xs">{s.label}</p>
                    <p className="text-lg font-extrabold text-slate-900 mt-0.5 wrap-break-word">
                      {s.valor ?? "—"}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* DESCRIÇÃO */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-extrabold text-slate-900 mb-4">Descrição</h2>
                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap wrap-break-word">
                  {casa.descricao}
                </div>
              </div>

              {/* LOCALIZAÇÃO */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-extrabold text-slate-900 mb-4">Localização</h2>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{casa.bairro}</p>
                      <p className="text-slate-500 text-sm">{casa.endereco}</p>
                    </div>
                  </div>
                  <a
                    href={linkMapa}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Abrir no mapa <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* CARD LATERAL (desktop) */}
            <aside className="hidden lg:block lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-xl shadow-slate-900/10 border border-slate-100 p-6"
              >
                <p className="text-slate-400 text-xs uppercase tracking-wider">Renda mensal</p>
                <p className="mt-1">
                  <span className="text-4xl font-extrabold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    {formatarPreco(casa.preco)}
                  </span>
                  <span className="text-slate-400 text-sm font-medium"> /mês</span>
                </p>

                <div className="flex flex-wrap gap-2 mt-5 pb-5 border-b border-slate-100">
                  {casa.tipo && (
                    <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                      {casa.tipo}
                    </span>
                  )}
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                    {casa.quartos} quartos
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                    {casa.banheiros} casas de banho
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={marcarVisita}
                  className="w-full mt-5 flex items-center justify-center gap-2 py-4 bg-linear-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 cursor-pointer"
                >
                  <CalendarCheck className="w-5 h-5" />
                  {user ? "Marcar Visita" : "Entrar para marcar visita"}
                </motion.button>
              </motion.div>
            </aside>
          </div>
        </div>

        {/* BARRA FIXA (mobile) */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-extrabold text-slate-900 leading-none">{formatarPreco(casa.preco)}</p>
            <p className="text-slate-400 text-xs mt-1">/mês</p>
          </div>
          <button
            onClick={marcarVisita}
            className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            {user ? "Marcar Visita" : "Entrar"}
          </button>
        </div>
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightbox && imagens.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            className="fixed inset-0 z-100 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center"
          >
            <button
              onClick={() => setLightbox(false)}
              aria-label="Fechar"
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {imagens.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); anterior(); }}
                  aria-label="Foto anterior"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); proxima(); }}
                  aria-label="Próxima foto"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold">
                  {fotoAtiva + 1} / {imagens.length}
                </span>
              </>
            )}

            <motion.div
              key={fotoAtiva}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[92vw] h-[78vh]"
            >
              <Image
                src={imagens[fotoAtiva]}
                alt={`${casa.titulo} - foto ${fotoAtiva + 1}`}
                fill
                className="object-contain"
                sizes="92vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}