import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient, SupabaseClient, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

interface AuthContextProps {
  session: Session | null;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  userData: {
    user_id: string;
    username: string;
  } | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<{
    user_id: string;
    username: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      if (session) {
        supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching user data:", error);
            } else if (data && data.length > 0) {
              console.log("User data:", data[0]);
              setUserData({
                user_id: data[0].user_id,
                username: data[0].username,
              });
            }
          });
      }
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return true;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push("/login-form" as any);
  };

  return (
    <AuthContext.Provider value={{ session, userData, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
