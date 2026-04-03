"use client"

import { AuthProvider } from "../contexts/AuthContext"
import CookieConsent from "../components/CookieConsent"

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <CookieConsent />
    </AuthProvider>
  )
}