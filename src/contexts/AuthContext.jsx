"use client";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
const pathname = usePathname();
const [perfilCompleto, setPerfilCompleto] = useState(true);

const carregarRole = async (userId) => {
  const { data } = await supabase
    .from("profiles")
    .select("role, perfil_completo")
    .eq("id", userId)
    .single();
  setRole(data?.role ?? "cliente");
  setPerfilCompleto(data?.perfil_completo ?? true);
};

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
      .catch((error) => {
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) carregarRole(session.user.id);
      else setRole(null);
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
  };

  return (
    <AuthContext.Provider
      value={{ user, role, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
