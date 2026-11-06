import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata = { title: "Política de Privacidade | CasaExpress" };

export default function Privacidade() {
  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Navbar />
      <main className="max-w-2xl mx-auto pt-24 pb-16 px-4 text-gray-700 text-sm leading-relaxed space-y-4">
        <h1 className="text-2xl font-extrabold text-gray-900">Política de Privacidade</h1>
        <p>O CasaExpress é uma plataforma de arrendamento de imóveis em Angola.</p>
        <h2 className="font-bold text-gray-900">Dados que recolhemos</h2>
        <p>Quando entras com Google ou Facebook, recebemos o teu nome, email (se disponível) e foto de perfil. Também pedimos o teu número de WhatsApp e o tipo de perfil (cliente ou intermediário).</p>
        <h2 className="font-bold text-gray-900">Como usamos</h2>
        <p>Usamos os dados para criar a tua conta, mostrar o teu perfil e permitir que a equipa do CasaExpress te contacte. O WhatsApp só é visível para a administração e, quando aplicável, para quem desbloqueia o contacto de um anúncio.</p>
        <h2 className="font-bold text-gray-900">Armazenamento e partilha</h2>
        <p>Os dados são guardados no Supabase e as imagens dos imóveis no Firebase. Não vendemos os teus dados a terceiros.</p>
        <h2 className="font-bold text-gray-900">Apagar os teus dados</h2>
        <p>Para apagar a tua conta e dados, envia um email para gelsonchissanda@gmail.com.</p>
      </main>
      <Footer />
    </div>
  );
}