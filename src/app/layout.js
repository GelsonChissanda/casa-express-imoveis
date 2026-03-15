import { AuthProvider } from "../contexts/AuthContext"
import "./globals.css"

export const metadata = {
  title: "Casa Express",
  description: "Plataforma de arrendamento em Luanda",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%230D47A1'><path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z'/></svg>",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}