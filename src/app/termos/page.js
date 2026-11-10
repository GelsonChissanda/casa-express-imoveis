import { FileText, Scale, UserCheck, Smartphone, Mail } from "lucide-react"
import PaginaLegal from "../../components/PaginaLegal"

export const metadata = { title: "Termos de Uso | CasaExpress" }

export default function Termos() {
  return (
    <PaginaLegal
      icone={FileText}
      titulo="Termos de Uso"
      subtitulo="As regras para usares o CasaExpress"
      intro="Ao usar o CasaExpress, aceitas estes termos."
      secoes={[
        {
          icone: Scale,
          titulo: "O papel do CasaExpress",
          texto:
            "O CasaExpress é um intermediário de divulgação: não é proprietário dos imóveis e não é parte nos contratos de arrendamento entre utilizadores.",
        },
        {
          icone: UserCheck,
          titulo: "Responsabilidade dos intermediários",
          texto:
            "Os intermediários são responsáveis pela veracidade dos anúncios que publicam. Anúncios falsos ou enganosos podem ser removidos e a conta suspensa.",
        },
        {
          icone: Smartphone,
          titulo: "Uso responsável",
          texto:
            "Deves fornecer um número de WhatsApp válido e usar a plataforma de forma responsável. Contas com comportamento abusivo podem ser bloqueadas.",
        },
        {
          icone: Mail,
          titulo: "Alterações e dúvidas",
          texto: (
            <>
              Podemos atualizar estes termos a qualquer momento. Dúvidas:{" "}
              <a
                href="mailto:gelsonchissanda@gmail.com"
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                gelsonchissanda@gmail.com
              </a>
              .
            </>
          ),
        },
      ]}
    />
  )
}