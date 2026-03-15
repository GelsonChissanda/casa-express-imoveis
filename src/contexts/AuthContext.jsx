"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Erro ao obter sessão:', error)
        setLoading(false)
      })

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })
      return () => subscription.unsubscribe()
    } catch (error) {
      console.error('Erro no onAuthStateChange:', error)
    }
  }, [])

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const register = async (email, password, nome) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome } }
    })
    return { data, error }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}