import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Auth() {
  const [tab, setTab] = useState("login");
  const [tipoConta, setTipoConta] = useState("cliente");
  const navigate = useNavigate();
  const { login: authLogin, register: authRegister } = useAuth();

  const [login, setLogin] = useState({ email: "", password: "" });
  const [errosLogin, setErrosLogin] = useState({});
  const [registo, setRegisto] = useState({ nome: "", email: "", password: "", confirmar: "" });
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
    if (Object.keys(erros).length > 0) { setErrosLogin(erros); return; }
    setLoading(true); setErroGeral("");
    const { error } = await authLogin(login.email, login.password);
    setLoading(false);
    if (error) { setErroGeral(error.message); return; }
    navigate("/dashboard");
  };

  const handleRegistar = async () => {
    const erros = {};
    if (!registo.nome.trim()) erros.nome = "Nome obrigatório";
    if (!registo.email.trim()) erros.email = "Email obrigatório";
    else if (!/\S+@\S+\.\S+/.test(registo.email)) erros.email = "Email inválido";
    if (!registo.password) erros.password = "Password obrigatória";
    else if (registo.password.length < 6) erros.password = "Mínimo 6 caracteres";
    if (registo.password !== registo.confirmar) erros.confirmar = "Passwords não coincidem";
    if (Object.keys(erros).length > 0) { setErrosRegisto(erros); return; }
    setLoading(true); setErroGeral("");
    const { error } = await authRegister(registo.email, registo.password, registo.nome);
    setLoading(false);
    if (error) { setErroGeral(error.message); return; }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-16 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Casa<span className="text-blue-600">Express</span></h1>
            <p className="text-gray-500 text-sm mt-1">A tua plataforma de arrendamento em Luanda</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              {[{ key: "login", label: "Entrar" }, { key: "registar", label: "Criar Conta" }].map((t) => (
                <button key={t.key} onClick={() => { setTab(t.key); setErroGeral(""); }}
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${tab === t.key ? "text-blue-800 border-b-2 border-blue-800 bg-blue-50/50" : "text-gray-500 hover:text-gray-700"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-8">
              {tab === "login" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                    <input type="email" placeholder="o.teu@email.com" value={login.email}
                      onChange={(e) => atualizarLogin("email", e.target.value)}
                      className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${errosLogin.email ? "border-red-400" : "border-gray-200"}`} />
                    {errosLogin.email && <p className="text-red-500 text-xs mt-1">{errosLogin.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                    <input type="password" placeholder="••••••••" value={login.password}
                      onChange={(e) => atualizarLogin("password", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${errosLogin.password ? "border-red-400" : "border-gray-200"}`} />
                    {errosLogin.password && <p className="text-red-500 text-xs mt-1">{errosLogin.password}</p>}
                  </div>
                  {erroGeral && <p className="text-red-500 text-xs text-center">{erroGeral}</p>}
                  <button onClick={handleLogin} disabled={loading}
                    className="w-full py-3 bg-blue-800 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-sm mt-2 disabled:opacity-50">
                    {loading ? "A entrar..." : "Entrar na minha conta"}
                  </button>
                  <p className="text-center text-xs text-gray-500 pt-2">
                    Ainda não tens conta?{" "}
                    <button onClick={() => setTab("registar")} className="text-blue-600 font-semibold hover:text-blue-800">Regista-te gratuitamente</button>
                  </p>
                </div>
              )}

              {tab === "registar" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Tipo de conta</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: "cliente", label: "Cliente", desc: "Procuro casa", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                        { key: "intermediario", label: "Intermediário", desc: "Publico casas", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
                      ].map((t) => (
                        <button key={t.key} onClick={() => setTipoConta(t.key)}
                          className={`p-3 rounded-xl border-2 text-left transition-colors ${tipoConta === t.key ? "border-blue-800 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
                          <svg className={`w-5 h-5 mb-1 ${tipoConta === t.key ? "text-blue-800" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
                          </svg>
                          <p className={`text-xs font-bold ${tipoConta === t.key ? "text-blue-800" : "text-gray-700"}`}>{t.label}</p>
                          <p className="text-xs text-gray-400">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nome completo</label>
                    <input type="text" placeholder="Ex: Maria Fernanda da Costa" value={registo.nome}
                      onChange={(e) => atualizarRegisto("nome", e.target.value)}
                      className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${errosRegisto.nome ? "border-red-400" : "border-gray-200"}`} />
                    {errosRegisto.nome && <p className="text-red-500 text-xs mt-1">{errosRegisto.nome}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                    <input type="email" placeholder="o.teu@email.com" value={registo.email}
                      onChange={(e) => atualizarRegisto("email", e.target.value)}
                      className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${errosRegisto.email ? "border-red-400" : "border-gray-200"}`} />
                    {errosRegisto.email && <p className="text-red-500 text-xs mt-1">{errosRegisto.email}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                      <input type="password" placeholder="••••••••" value={registo.password}
                        onChange={(e) => atualizarRegisto("password", e.target.value)}
                        className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${errosRegisto.password ? "border-red-400" : "border-gray-200"}`} />
                      {errosRegisto.password && <p className="text-red-500 text-xs mt-1">{errosRegisto.password}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirmar</label>
                      <input type="password" placeholder="••••••••" value={registo.confirmar}
                        onChange={(e) => atualizarRegisto("confirmar", e.target.value)}
                        className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${errosRegisto.confirmar ? "border-red-400" : "border-gray-200"}`} />
                      {errosRegisto.confirmar && <p className="text-red-500 text-xs mt-1">{errosRegisto.confirmar}</p>}
                    </div>
                  </div>

                  {erroGeral && <p className="text-red-500 text-xs text-center">{erroGeral}</p>}

                  <button onClick={handleRegistar} disabled={loading}
                    className="w-full py-3 bg-blue-800 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
                    {loading ? "A criar conta..." : "Criar conta gratuita"}
                  </button>

                  <p className="text-center text-xs text-gray-500">
                    Já tens conta?{" "}
                    <button onClick={() => setTab("login")} className="text-blue-600 font-semibold hover:text-blue-800">Entrar</button>
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Ao continuar, aceitas os <span className="text-blue-600 cursor-pointer">Termos de Uso</span> e a <span className="text-blue-600 cursor-pointer">Política de Privacidade</span>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}