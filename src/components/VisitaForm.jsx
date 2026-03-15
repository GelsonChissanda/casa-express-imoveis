import { useState } from "react";

// Formulário para marcar visita a uma casa
export default function VisitaForm({ casaId, onSubmit }) {
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    data: "",
    hora: "",
    mensagem: "",
  });
  const [erros, setErros] = useState({});
  const [submetido, setSubmetido] = useState(false);

  const atualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: "" }));
  };

  // Validação básica dos campos obrigatórios
  const validar = () => {
    const novosErros = {};
    if (!form.nome.trim()) novosErros.nome = "Nome é obrigatório";
    if (!form.telefone.trim()) novosErros.telefone = "Telefone é obrigatório";
    if (!form.email.trim()) novosErros.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(form.email)) novosErros.email = "Email inválido";
    if (!form.data) novosErros.data = "Data é obrigatória";
    if (!form.hora) novosErros.hora = "Hora é obrigatória";
    return novosErros;
  };

  const handleSubmit = () => {
    const novosErros = validar();
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }
    setSubmetido(true);
    if (onSubmit) onSubmit({ ...form, casaId });
  };

  // Ecrã de confirmação após submissão
  if (submetido) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Visita marcada com sucesso!</h3>
        <p className="text-green-700 text-sm mb-1">
          Recebemos o teu pedido de visita para <strong>{form.data}</strong> às <strong>{form.hora}</strong>.
        </p>
        <p className="text-green-600 text-sm">
          O intermediário irá entrar em contacto através do <strong>{form.telefone}</strong>.
        </p>
        <button
          onClick={() => setSubmetido(false)}
          className="mt-6 px-6 py-2 text-sm font-semibold text-green-700 border border-green-300 rounded-xl hover:bg-green-100 transition-colors"
        >
          Marcar outra visita
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
        <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </span>
        Marcar Visita
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Nome */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Nome completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: João Manuel da Silva"
            value={form.nome}
            onChange={(e) => atualizar("nome", e.target.value)}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 ${erros.nome ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          {erros.nome && <p className="text-red-500 text-xs mt-1">{erros.nome}</p>}
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Telefone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="Ex: +244 923 456 789"
            value={form.telefone}
            onChange={(e) => atualizar("telefone", e.target.value)}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 ${erros.telefone ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          {erros.telefone && <p className="text-red-500 text-xs mt-1">{erros.telefone}</p>}
        </div>

        {/* Email */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Ex: joao@email.com"
            value={form.email}
            onChange={(e) => atualizar("email", e.target.value)}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 ${erros.email ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          {erros.email && <p className="text-red-500 text-xs mt-1">{erros.email}</p>}
        </div>

        {/* Data */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Data preferida <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={form.data}
            onChange={(e) => atualizar("data", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 ${erros.data ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          {erros.data && <p className="text-red-500 text-xs mt-1">{erros.data}</p>}
        </div>

        {/* Hora */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Hora preferida <span className="text-red-500">*</span>
          </label>
          <select
            value={form.hora}
            onChange={(e) => atualizar("hora", e.target.value)}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 ${erros.hora ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Selecionar hora</option>
            {["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"].map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          {erros.hora && <p className="text-red-500 text-xs mt-1">{erros.hora}</p>}
        </div>

        {/* Mensagem opcional */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Mensagem <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <textarea
            placeholder="Alguma questão ou informação adicional..."
            value={form.mensagem}
            onChange={(e) => atualizar("mensagem", e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 resize-none"
          />
        </div>
      </div>

      {/* Botão submeter */}
      <button
        onClick={handleSubmit}
        className="mt-5 w-full py-3 text-sm font-bold text-white bg-blue-800 rounded-xl hover:bg-blue-700 active:bg-blue-900 transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
        Confirmar Visita
      </button>
    </div>
  );
}
