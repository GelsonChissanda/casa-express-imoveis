"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [perfilCompleto, setPerfilCompleto] = useState(true);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const carregarRole = async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("role, perfil_completo")
      .eq("id", userId)
      .single();
    setRole(data?.role ?? "cliente");
    setPerfilCompleto(data?.perfil_completo ?? true);
  };

  // Perfil incompleto: manda para o ecrã de completar
  useEffect(() => {
    if (user && perfilCompleto === false && pathname !== "/completar-perfil") {
      router.replace("/completar-perfil");
    }
  }, [user, perfilCompleto, pathname, router]);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) carregarRole(session.user.id);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) carregarRole(session.user.id);
      else {
        setRole(null);
        setPerfilCompleto(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const register = async (email, password, nome, tipoConta) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome, tipoConta } },
    });
    return { data, error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setPerfilCompleto(true);
  };

  const recarregarPerfil = async () => {
    if (user) await carregarRole(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        login,
        register,
        logout,
        recarregarPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
