import { ShieldCheck, Database, Eye, Lock, Trash2 } from "lucide-react"
import PaginaLegal from "../../components/PaginaLegal"

export const metadata = { title: "Política de Privacidade | CasaExpress" }

export default function Privacidade() {
  return (
    <PaginaLegal
      icone={ShieldCheck}
      titulo="Política de Privacidade"
      subtitulo="Como tratamos os teus dados"
      intro="O Casa Express é uma plataforma de arrendamento de imóveis em Angola."
      secoes={[
        {
          icone: Database,
          titulo: "Dados que recolhemos",
          texto:
            "Quando entras com Google ou Facebook, recebemos o teu nome, email (se disponível) e foto de perfil. Também pedimos o teu número de WhatsApp e o tipo de perfil (cliente ou intermediário).",
        },
        {
          icone: Eye,
          titulo: "Como usamos",
          texto:
            "Usamos os dados para criar a tua conta, mostrar o teu perfil e permitir que a equipa do CasaExpress te contacte. O WhatsApp só é visível para a administração e, quando aplicável, para quem desbloqueia o contacto de um anúncio.",
        },
        {
          icone: Lock,
          titulo: "Armazenamento e partilha",
          texto:
            "Os dados são guardados no Supabase e as imagens dos imóveis no Firebase. Não vendemos os teus dados a terceiros.",
        },
        {
          icone: Trash2,
          titulo: "Apagar os teus dados",
          texto: (
            <>
              Para apagar a tua conta e dados, envia um email para{" "}
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