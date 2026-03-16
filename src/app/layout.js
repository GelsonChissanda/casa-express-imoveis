// SEM "use client" aqui!
import Providers from "./providers"
import "./globals.css"

export const metadata = {
  title: "Casa Express",
  description: "Plataforma de arrendamento em Luanda",
  icons: {
    icon: "data:image/svg+xml,...",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}