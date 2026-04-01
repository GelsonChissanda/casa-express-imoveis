// SEM "use client" aqui!
import Providers from "./providers"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from "@next/third-parties/google"

export const metadata = {
  title: "CasaExpress — Arrendamento de Casas em Luanda",
  description: "Encontra casas para arrendar em Luanda. Talatona, Kilamba, Miramar e mais. Seguro, rápido e gratuito.",
  keywords: "casas arrendamento Luanda, alugar casa Angola, imóveis Luanda, Talatona, Kilamba",
  verification: {
    google: "_Gpwf7UVGn2ch_54Gtot0izRxYH5GGssyadj6eAW-PM",
  },
  openGraph: {
    title: "CasaExpress — Arrendamento de Casas em Luanda",
    description: "Encontra casas para arrendar em Luanda. Seguro, rápido e gratuito.",
    url: "https://casaexpress.vercel.app",
    siteName: "CasaExpress",
    locale: "pt_AO",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <GoogleAnalytics gaId="G-M4GW70BT3H" />
      </body>
    </html>
  )
}