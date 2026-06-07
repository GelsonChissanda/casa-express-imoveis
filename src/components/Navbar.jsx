"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)

  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

 useEffect(() => {
  if (menuAberto) setMenuAberto(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [pathname])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Erro ao sair:", error)
    }
  };

  const links = [
    { label: "Ver Casas", href: "/casas" },
    { label: "Como Funciona", href: "/#como-funciona" },
    { label: "Bairros", href: "/#bairros" },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-white shadow-sm"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-blue-800 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-blue-900 tracking-tight">Casa<span className="text-blue-500">Express</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-gray-600 hover:text-blue-800 transition-colors cursor-pointer">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold text-blue-800 border border-blue-800 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors cursor-pointer">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" className="px-4 py-2 text-sm font-semibold text-blue-800 border border-blue-800 rounded-lg hover:bg-blue-50 transition-colors">
                  Entrar
                </Link>
                <Link href="/auth" className="px-4 py-2 text-sm font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-700 transition-colors">
                  Registar
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setMenuAberto(!menuAberto)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            {menuAberto ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuAberto && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3 shadow-lg">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-gray-700 hover:text-blue-800 py-2 border-b border-gray-50 transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            {user ? (
              <>
                <button
                  onClick={() => { setMenuAberto(false); router.push("/dashboard") }}
                  className="flex-1 text-center py-2 text-sm font-semibold text-blue-800 border border-blue-800 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 text-center py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors cursor-pointer">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" className="flex-1 text-center py-2 text-sm font-semibold text-blue-800 border border-blue-800 rounded-lg hover:bg-blue-50 transition-colors">
                  Entrar
                </Link>
                <Link href="/auth" className="flex-1 text-center py-2 text-sm font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-700 transition-colors">
                  Registar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}