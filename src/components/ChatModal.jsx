"use client";
import { useState, useEffect } from "react";
import { visitasService } from "../services/visitasService";

export default function ChatModal({ visita, userId, titulo, onClose }) {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  const carregar = async () => {
    try {
      setMensagens(await visitasService.obterMensagens(visita.id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    carregar();
  }, []); // eslint-disable-line

  const jaEnviei = mensagens.some((m) => m.autor_id === userId);

  const enviar = async () => {
    if (!texto.trim()) return;
    try {
      setEnviando(true);
      await visitasService.enviarMensagem(visita.id, userId, texto.trim());
      setTexto("");
      await carregar();
    } catch {
      alert("Erro ao enviar mensagem");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Chat · {titulo}</h3>
          <button onClick={onClose} className="text-slate-400 cursor-pointer">
            Fechar
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {mensagens.length === 0 && (
            <p className="text-slate-400 text-sm">Ainda sem mensagens.</p>
          )}
          {mensagens.map((m) => (
            <div
              key={m.id}
              className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] ${
                m.autor_id === userId
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              {m.texto}
            </div>
          ))}
        </div>

        {!jaEnviei && (
          <div className="space-y-2">
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Escreve a tua resposta (só podes enviar 1 mensagem)"
              className="w-full border border-slate-200 rounded-xl p-3 text-sm"
            />
            <button
              onClick={enviar}
              disabled={enviando}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50"
            >
              {enviando ? "A enviar..." : "Enviar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}