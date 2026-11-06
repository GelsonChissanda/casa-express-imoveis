"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabaseClient";

export default function Auth() {
  const [tab, setTab] = useState("login");
  const router = useRouter();
  const { login: authLogin, register: authRegister } = useAuth();

  const [login, setLogin] = useState({ email: "", password: "" });
  const [errosLogin, setErrosLogin] = useState({});
  const [registo, setRegisto] = useState({
    nome: "",
    email: "",
    password: "",
    confirmar: "",
  });
  const [errosRegisto, setErrosRegisto] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [loading, setLoading] = useState(false);

  const atualizarLogin = (campo, valor) => {
    setLogin((p) => ({ ...p, [campo]: valor }));
    if (errosLogin[campo]) setErrosLogin((p) => ({ ...p, [campo]: "" }));
  };

  const atualizarRegisto = (campo, valor) => {
    setRegisto((p) => ({ ...p, [campo]: valor }));
    if (errosRegisto[campo]) setErrosRegisto((p) => ({ ...p, [campo]: "" }));
  };

  const handleLogin = async () => {
    const erros = {};
    if (!login.email.trim()) erros.email = "Email obrigatório";
    else if (!/\S+@\S+\.\S+/.test(login.email)) erros.email = "Email inválido";
    if (!login.password) erros.password = "Password obrigatória";
    if (Object.keys(erros).length > 0) {
      setErrosLogin(erros);
      return;
    }
    setLoading(true);
    setErroGeral("");
    const { error } = await authLogin(login.email, login.password);
    setLoading(false);
    if (error) {
      setErroGeral(error.message);
      return;
    }
    router.push("/dashboard");
  };

  const handleRegistar = async () => {
  const erros = {};
  if (!registo.nome.trim()) erros.nome = "Nome obrigatório";
  if (!/\S+@\S+\.\S+/.test(registo.email)) erros.email = "Email inválido";
  if (registo.password.length < 6) erros.password = "Mínimo 6 caracteres";
  if (registo.confirmar !== registo.password) erros.confirmar = "As passwords não coincidem";
  if (Object.keys(erros).length > 0) { setErrosRegisto(erros); return; }
  setLoading(true);
  setErroGeral("");
  const { error } = await authRegister(registo.email, registo.password, registo.nome, "cliente");
  setLoading(false);
  if (error) { setErroGeral(error.message); return; }
  await new Promise((resolve) => setTimeout(resolve, 1500));
  router.push("/completar-perfil");
};

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
            <div className="flex border-b border-gray-100">
              {[
                { key: "login", label: "Entrar" },
                { key: "registar", label: "Criar Conta" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setTab(t.key);
                    setErroGeral("");
                  }}
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${tab === t.key ? "text-blue-800 border-b-2 border-blue-800 cursor-pointer bg-blue-50/50" : "text-gray-500 cursor-pointer hover:text-gray-700"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-8">
              <button
  onClick={handleFacebook}
  className="w-full cursor-pointer py-3 bg-[#1877F2] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity mb-4"
>
  Continuar com Facebook
</button>
<button
  onClick={handleGoogle}
  className="w-full cursor-pointer py-3 bg-white text-gray-700 border border-gray-200 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors mb-4"
>
  Continuar com Google
</button>
              {tab === "login" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="o.teu@email.com"
                      value={login.email}
                      onChange={(e) => atualizarLogin("email", e.target.value)}
                      className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${errosLogin.email ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errosLogin.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errosLogin.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={login.password}
                      onChange={(e) =>
                        atualizarLogin("password", e.target.value)
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${errosLogin.password ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errosLogin.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errosLogin.password}
                      </p>
                    )}
                  </div>
                  {erroGeral && (
                    <p className="text-red-500 text-xs text-center">
                      {erroGeral}
                    </p>
                  )}
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full cursor-pointer py-3 bg-blue-800 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-sm mt-2 disabled:opacity-50"
                  >
                    {loading ? "A entrar..." : "Entrar na minha conta"}
                  </button>
                  <p className="text-center text-xs text-gray-500 pt-2">
                    Ainda não tens conta?{" "}
                    <button
                      onClick={() => setTab("registar")}
                      className="text-blue-600 font-semibold cursor-pointer hover:text-blue-800"
                    >
                      Regista-te gratuitamente
                    </button>
                  </p>
                </div>
              )}

              {tab === "registar" && (
                <div className="space-y-4">
                    

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Gelson Chissanda"
                      value={registo.nome}
                      onChange={(e) => atualizarRegisto("nome", e.target.value)}
                      className={`w-full  px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${errosRegisto.nome ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errosRegisto.nome && (
                      <p className="text-red-500 text-xs mt-1">
                        {errosRegisto.nome}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="o.teu@email.com"
                      value={registo.email}
                      onChange={(e) =>
                        atualizarRegisto("email", e.target.value)
                      }
                      className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${errosRegisto.email ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errosRegisto.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errosRegisto.email}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={registo.password}
                        onChange={(e) =>
                          atualizarRegisto("password", e.target.value)
                        }
                        className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${errosRegisto.password ? "border-red-400" : "border-gray-200"}`}
                      />
                      {errosRegisto.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errosRegisto.password}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Confirmar
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={registo.confirmar}
                        onChange={(e) =>
                          atualizarRegisto("confirmar", e.target.value)
                        }
                        className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${errosRegisto.confirmar ? "border-red-400" : "border-gray-200"}`}
                      />
                      {errosRegisto.confirmar && (
                        <p className="text-red-500 text-xs mt-1">
                          {errosRegisto.confirmar}
                        </p>
                      )}
                    </div>
                  </div>
                  {erroGeral && (
                    <p className="text-red-500 text-xs text-center">
                      {erroGeral}
                    </p>
                  )}
                  <button
                    onClick={handleRegistar}
                    disabled={loading}
                    className="w-full cursor-pointer py-3 bg-blue-800 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {loading ? "A criar conta..." : "Criar conta gratuita"}
                  </button>
                  <p className="text-center text-xs text-gray-500">
                    Já tens conta?{" "}
                    <button
                      onClick={() => setTab("login")}
                      className="text-blue-600 font-semibold cursor-pointer hover:text-blue-800"
                    >
                      Entrar
                    </button>
                  </p>
                </div>
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
