import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function PaginaLegal({ icone: Icone, titulo, subtitulo, intro, secoes }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* HERO */}
      <header className="relative overflow-hidden bg-slate-950 pt-28 pb-28">
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

        <div className="relative max-w-3xl mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao início
          </Link>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-blue-500/30">
              <Icone className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-cyan-300 text-xs font-semibold uppercase tracking-[0.2em] mb-1">
                CasaExpress
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {titulo}
              </h1>
              {subtitulo && <p className="text-slate-400 text-sm mt-1">{subtitulo}</p>}
            </div>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="max-w-3xl mx-auto px-4 -mt-14 relative z-10 pb-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-900/10 border border-slate-100 p-6 sm:p-10">
          {intro && (
            <p className="text-slate-700 text-base leading-relaxed border-l-4 border-blue-500 pl-4 mb-10">
              {intro}
            </p>
          )}

          <div>
            {secoes.map((s, i) => (
              <section
                key={s.titulo}
                className="flex gap-4 sm:gap-5 py-7 border-b border-slate-100 first:pt-0 last:border-0 last:pb-0"
              >
                <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <s.icone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg mb-2">
                    <span className="text-blue-500 mr-2">{String(i + 1).padStart(2, "0")}</span>
                    {s.titulo}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">{s.texto}</p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}