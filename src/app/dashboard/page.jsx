"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"

import DashboardIntermediario from "./DashboardIntermediario"
import DashboardCliente from "./DashboardCliente"
import DashboardAdmin from "./DashboardAdmin"

export default function Dashboard() {
  const { user, role, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth")
  }, [authLoading, user, router])

  if (authLoading || !user || !role) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">A carregar o teu painel...</p>
      </div>
    </div>
  )

  if (role === "admin") return <DashboardAdmin />
  if (role === "intermediario") return <DashboardIntermediario />
  return <DashboardCliente />
}