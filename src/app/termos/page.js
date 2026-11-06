import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata = { title: "Termos de Uso | CasaExpress" };

export default function Termos() {
  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Navbar />
      <main className="max-w-2xl mx-auto pt-24 pb-16 px-4 text-gray-700 text-sm leading-relaxed space-y-4">
        <h1 className="text-2xl font-extrabold text-gray-900">Termos de Uso</h1>
        <p>Ao usar o CasaExpress, aceitas estes termos.</p>
        <p>O CasaExpress é um intermediário de divulgação: não é proprietário dos imóveis e não é parte nos contratos de arrendamento entre utilizadores.</p>
        <p>Os intermediários são responsáveis pela veracidade dos anúncios que publicam. Anúncios falsos ou enganosos podem ser removidos e a conta suspensa.</p>
        <p>Deves fornecer um número de WhatsApp válido e usar a plataforma de forma responsável. Contas com comportamento abusivo podem ser bloqueadas.</p>
        <p>Podemos atualizar estes termos a qualquer momento. Dúvidas: gelsonchissanda@gmail.com.</p>
      </main>
      <Footer />
    </div>
  );
}