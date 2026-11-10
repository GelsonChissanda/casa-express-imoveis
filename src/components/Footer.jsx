import Link from "next/link"



export default function Footer() {


  return (
    <footer className="bg-[#2D3148] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 flex items-center justify-center transition-colors">
              <svg width="916" height="613" viewBox="0 0 916 613" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_2604_6)">
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
            <p className="text-sm text-gray-400 leading-relaxed">
              A plataforma líder de arrendamento de casas em Luanda. Encontra a tua casa ideal com facilidade e segurança.
            </p>
          </div>

          <div>
            
            <ul className="space-y-2">
              
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Bairros</h4>
            <ul className="space-y-2">
              {["Talatona", "Camama", "Kilamba", "Calemba 2", "Maianga", "Ingombota", "Viana"].map((bairro) => (
                <li key={bairro}>
                  <Link href={`/casas?bairro=${bairro}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {bairro}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Suporte</h4>
            
            <ul className="space-y-2 mb-6">
              {[
  { label: "Centro de Ajuda", href: "/ajuda" },
  { label: "Contacta-nos", href: "/contacto" },
  { label: "Termos de Uso", href: "/termos" },
  { label: "Privacidade", href: "/privacidade" },
].map((item) => (
  <li key={item.href}>
    <Link href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
      {item.label}
    </Link>
  </li>
))}
            </ul>

            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Redes Sociais</h4>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                </svg>
              </a>
              <a href="https://wa.me/244972406191?text=Olá%21+Preciso+de+ajuda+com+a+plataforma+CasaExpress.+Pode+ajudar-me%3F" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L0 24l6.335-1.505A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.727.976.993-3.631-.234-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} CasaExpress. Todos os direitos reservados.</p>
          <p className="text-xs text-gray-500">Feito por <a href="https://www.linkedin.com/in/gelsonchissanda" target="_blank" rel="noopener noreferrer" className="text-blue-500 font-bold cursor-pointer">Gelson Chissanda</a></p>
        </div>
      </div>
    </footer>
  )
}