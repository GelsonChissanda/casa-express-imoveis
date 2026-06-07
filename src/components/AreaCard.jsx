"use client"

import { useRouter } from "next/navigation"

export default function AreaCard({ nome, quantidade, gradiente }) {
  const router = useRouter()

  const gradientes = {
    azul: "from-blue-900 to-blue-600",
    ciano: "from-cyan-700 to-blue-500",
    indigo: "from-indigo-800 to-blue-600",
    royal: "from-blue-800 to-indigo-600",
    escuro: "from-slate-700 to-blue-700",
  }

  const gradienteClass = gradientes[gradiente] || gradientes.azul

  return (
    <div
      onClick={() => router.push(`/casas?bairro=${nome}`)}
      className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${gradienteClass} cursor-pointer group h-36 sm:h-44 flex flex-col justify-end p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
      <div className="absolute top-3 right-3 w-20 h-20 border border-white/20 rounded-full group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute top-6 right-6 w-10 h-10 border border-white/20 rounded-full" />
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/5 rounded-full" />

      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-1">
          <svg className="w-3.5 h-3.5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-blue-200 text-xs font-medium">Luanda</span>
        </div>
        <h3 className="text-white text-xl font-bold tracking-tight group-hover:text-blue-100 transition-colors">{nome}</h3>
        <p className="text-blue-100/80 text-xs mt-1 font-medium">
          {quantidade} casa{quantidade !== 1 ? "s" : ""} disponíve{quantidade !== 1 ? "is" : "l"}
        </p>
      </div>

      <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}