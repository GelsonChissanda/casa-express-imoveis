"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabaseClient";

export default function Auth() {
  const [erroGeral, setErroGeral] = useState("");

  const handleFacebook = async () => {
    setErroGeral("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: `${window.location.origin}/completar-perfil` },
    });
    if (error) setErroGeral(error.message);
  };

  const handleGoogle = async () => {
    setErroGeral("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/completar-perfil` },
    });
    if (error) setErroGeral(error.message);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-16 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Casa<span className="text-blue-600">Express</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              A tua plataforma de arrendamento em Luanda
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-center text-base font-bold text-gray-900 mb-1">
                Entrar ou criar conta
              </h2>
              <p className="text-center text-xs text-gray-500 mb-6">
                Escolhe uma das opções abaixo para continuar
              </p>

              <button
                onClick={handleFacebook}
                className="w-full cursor-pointer py-3 bg-[#1877F2] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity mb-4"
              >
                Continuar com Facebook
              </button>
              <button
                onClick={handleGoogle}
                className="w-full cursor-pointer py-3 bg-white text-gray-700 border border-gray-200 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors"
              >
                Continuar com Google
              </button>

              {erroGeral && (
                <p className="text-red-500 text-xs text-center mt-4">
                  {erroGeral}
                </p>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Ao continuar, aceitas os{" "}
            <a href="/termos" className="text-blue-600 hover:text-blue-800">
              Termos de Uso
            </a>{" "}
            e a{" "}
            <a href="/privacidade" className="text-blue-600 hover:text-blue-800">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}