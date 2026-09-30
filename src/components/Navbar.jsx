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
            <div className="w-9 h-9 flex items-center justify-center transition-colors">
              <svg width="916" height="613" viewBox="0 0 916 613" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2604_6)">
<path opacity="0.89" d="M234 220.565L307 195V359.754L234 391V220.565Z" fill="#1442B0"/>
<path d="M385 140H458V290.364L385 321V140Z" fill="#1442B0"/>
<path d="M537 267.571L609 248V354L537 324.373V267.571Z" fill="#1442B0"/>
<path d="M307 198L385 219.389V233L307 219.389V198Z" fill="#1442B0"/>
<path d="M458 141L578 162.328L558 176L458 155V141Z" fill="#1442B0"/>
<path d="M558 173.696L575 164V283H558V173.696Z" fill="#1442B0"/>
<path d="M609 248L698 272.5V283L609 258.776V248Z" fill="#1442B0"/>
<path d="M688 270L699 275.486V396L688 389.936V270Z" fill="#1442B0"/>
<path d="M465.876 329L914 526L465.876 431.878L2 526L465.876 329Z" fill="#1442B0"/>
<path d="M779.221 436C844.191 400.46 890.751 346.75 907.927 297.374C925.102 247.998 914.732 196.938 878.165 150.828C841.597 104.719 780.523 65.6915 702.878 38.8181C625.232 11.9448 534.607 -1.53218 442.776 0.138492C350.946 1.80916 262.157 18.5502 187.948 48.1863C113.738 77.8223 57.5387 118.983 26.6525 166.32C-4.23371 213.657 -8.37878 264.981 14.7559 313.624C37.8906 362.266 71.2621 402.899 140.405 436L209.312 403.234C153.314 376.426 117.76 341.025 99.0237 301.63C80.2873 262.236 83.6443 220.669 108.659 182.332C133.673 143.994 179.188 110.659 239.289 86.657C299.39 62.6553 371.299 49.0969 445.671 47.7439C520.042 46.3908 593.439 57.3056 656.322 79.0699C719.206 100.834 768.669 132.442 798.285 169.785C827.9 207.129 836.298 248.482 822.388 288.47C808.478 328.459 770.186 374.45 717.568 403.234L779.221 436Z" fill="#2B7FFF"/>
<rect x="338" y="499" width="101" height="51" fill="#0088FF"/>
<rect x="465" y="499" width="102" height="51" fill="#0088FF"/>
<rect x="338" y="562" width="101" height="51" fill="#0088FF"/>
<rect x="465" y="562" width="102" height="51" fill="#0088FF"/>
</g>
<defs>
<clipPath id="clip0_2604_6">
<rect width="916" height="613" fill="white"/>
</clipPath>
</defs>
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