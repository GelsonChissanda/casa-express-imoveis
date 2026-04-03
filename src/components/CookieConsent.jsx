"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já aceitou ou rejeitou cookies
    const consentido = localStorage.getItem("cookieConsent");
    if (!consentido) {
      // Usar setTimeout para evitar setState síncrono no effect
      setTimeout(() => setMostrar(true), 0);
    }
  }, []);

  const handleAceitar = () => {
    localStorage.setItem("cookieConsent", "aceito");
    setMostrar(false);
  };

  const handleRejeitar = () => {
    localStorage.setItem("cookieConsent", "rejeitado");
    setMostrar(false);
  };

  if (!mostrar) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">🍪 Consentimento de Cookies</h3>
          <p className="text-sm text-gray-300">
            Usamos cookies para melhorar sua experiência, personalizar conteúdo e analisar nosso tráfego. 
            Ao clicar em &quot;Aceitar&quot;, você concorda com o uso de cookies.
          </p>
        </div>

        <div className="flex gap-3 whitespace-nowrap">
          <button
            onClick={handleRejeitar}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors"
          >
            Rejeitar
          </button>
          <button
            onClick={handleAceitar}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
