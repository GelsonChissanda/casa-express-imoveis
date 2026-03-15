import { useState } from "react";

export default function FiltrosCasas({ onFiltrar }) {
  const [bairro, setBairro] = useState("");
  const [tipo, setTipo] = useState("");
  const [precoMax, setPrecoMax] = useState("");

  const handleFiltrar = () => {
    onFiltrar({ bairro, tipo, preco_max: precoMax });
  };

  const handleLimpar = () => {
    setBairro("");
    setTipo("");
    setPrecoMax("");
    onFiltrar({ bairro: "", tipo: "", preco_max: "" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">

        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bairro</label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Ex: Talatona, Kilamba..."
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFiltrar()}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="sm:w-36">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tipologia</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 appearance-none cursor-pointer"
          >
            <option value="">Todos</option>
            <option value="T1">T1</option>
            <option value="T2">T2</option>
            <option value="T3">T3</option>
            <option value="T4+">T4+</option>
          </select>
        </div>

        <div className="sm:w-44">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Preço máximo</label>
          <select
            value={precoMax}
            onChange={(e) => setPrecoMax(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 appearance-none cursor-pointer"
          >
            <option value="">Sem limite</option>
            <option value="50000">50.000 Kz</option>
            <option value="100000">100.000 Kz</option>
            <option value="150000">150.000 Kz</option>
            <option value="200000">200.000 Kz</option>
            <option value="300000">300.000 Kz</option>
            <option value="500000">500.000 Kz</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleLimpar}
            className="px-4 py-2.5 text-sm font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Limpar
          </button>
          <button
            onClick={handleFiltrar}
            className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-semibold text-white bg-blue-800 rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Pesquisar
          </button>
        </div>
      </div>
    </div>
  );
}