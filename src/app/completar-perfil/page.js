"use client"
import { useState } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function CompletarPerfil() {
  const [whatsapp, setWhatsapp] = useState("")
  const [role, setRole] = useState("client")

  function guardar() {
    // etapa 3: guardar em profiles (tu escreves)
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-linear-to-r from-blue-900 to-blue-700 pt-24 pb-24">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">Quase lá</p>
            <h1 className="text-4xl font-bold text-white mb-2">Completar perfil</h1>
            <p className="text-blue-200">Só mais dois dados para começares no CasaExpress</p>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 -mt-12 pb-16">
          <div className="bg-white rounded-xl shadow p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp</label>
              <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ex.: 923 000 000"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="text-gray-400 text-xs mt-1">Só a equipa do CasaExpress vê este número.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de perfil</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="client">Cliente</option>
                <option value="intermediary">Intermediário</option>
              </select>
            </div>
            <button onClick={guardar} disabled={!whatsapp}
              className="w-full px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
              Continuar
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}