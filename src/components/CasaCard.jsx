"use client"
 
import { useState } from "react"
import { useRouter } from "next/navigation"
 
export default function CasaCard({ titulo, preco, bairro, quartos, casasDeBanho, banheiros, badge, id, imagem_url, imagens_urls }) {
  const [favorito, setFavorito] = useState(false)
  const router = useRouter()
 
  const wc = casasDeBanho ?? banheiros ?? 0
  const foto = imagens_urls?.[0] || imagem_url
 
  const formatarPreco = (valor) =>
    new Intl.NumberFormat("pt-AO").format(valor) + " Kz/mês"
 
  const badgeEstilo = {
    Novo: "bg-green-500 text-white",
    Destaque: "bg-yellow-400 text-yellow-900",
    Popular: "bg-blue-600 text-white",
  }
 
  return (
    <div
      onClick={() => router.push(`/casas/${id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:-translate-y-1"
    >
      <div className="relative h-48 bg-linear-to-br from-blue-800 to-blue-500 flex items-center justify-center overflow-hidden">
        {foto ? (
          <img src={foto} alt={titulo} className="w-full h-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-6 right-6 w-10 h-10 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-2 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <svg className="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
          </>
        )}
 
        {badge && (
          <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${badgeEstilo[badge] || "bg-gray-500 text-white"}`}>
            {badge}
          </span>
        )}
 
        <button
          onClick={(e) => { e.stopPropagation(); setFavorito(!favorito) }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <svg
            className={`w-4 h-4 transition-colors ${favorito ? "text-red-500 fill-red-500" : "text-gray-400"}`}
            fill={favorito ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
 
      <div className="p-4">
        <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold mb-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {bairro}
        </div>
 
        <h3 className="font-semibold text-gray-800 text-sm mb-3 line-clamp-2 group-hover:text-blue-800 transition-colors">
          {titulo}
        </h3>
 
        <div className="flex items-center gap-3 text-gray-500 text-xs mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            {quartos} quarto{quartos !== 1 ? "s" : ""}
          </span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1H3a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1H5zm-1 7a1 1 0 000 2h12a1 1 0 100-2H4z" clipRule="evenodd" />
            </svg>
            {wc} WC
          </span>
        </div>
 
        <div className="flex items-center justify-between">
          <span className="text-blue-800 font-bold text-base">{formatarPreco(preco)}</span>
          <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-lg group-hover:bg-blue-100 transition-colors">
            Ver detalhes →
          </span>
        </div>
      </div>
    </div>
  )
}
 