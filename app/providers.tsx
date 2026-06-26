"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  supabase_uid: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  plan: string;
  xp: number;
  streak_count: number;
  preferences?: {
    topics?: string[];
    selected_subtopic_ids?: string[];
    news_topics?: string[];
    difficulty_pref?: string;
    article_frequency?: number;
    reading_pace?: number;
  };
  learning_profile?: {
    current_level: number;
    confidence: number;
    level_source: string;
    placement_attempt_id?: string | null;
    updated_at: string;
  } | null;
}

interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  isLoading: boolean;
  refreshUser: (redirect?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session: initSession } }) => {
      setSession(initSession);
      if (initSession) {
        verifyUserWithBackend(initSession);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      // Only update if session status changed OR token changed
      setSession(prev => {
        if (!prev && !newSession) return null;
        if (prev?.access_token === newSession?.access_token) return prev;
        return newSession;
      });

      if (newSession) {
        verifyUserWithBackend(newSession);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const processingRef = React.useRef<string | null>(null);

  const verifyUserWithBackend = async (
    currentSession: Session,
    options: { force?: boolean; redirect?: boolean } = {},
  ) => {
    if (!options.force && processingRef.current === currentSession.access_token) return;
    processingRef.current = currentSession.access_token;
    
    // Only show loading if we haven't identified the user yet
    if (!user) setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentSession.access_token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        const needsOnboarding =
          !userData.preferences ||
          !userData.preferences.topics ||
          userData.preferences.topics.length === 0 ||
          !userData.learning_profile;
        const currentPath = window.location.pathname;

        if (options.redirect !== false) {
          if (needsOnboarding) {
            if (!currentPath.startsWith('/onboarding')) {
               router.push("/onboarding");
            }
          } else {
            // Send returning users away from Auth or Root to Home
            if (currentPath === '/auth' || currentPath === '/') {
               router.push("/home");
            }
          }
        }
      } else {
        console.error("Backend auth verification failed", await response.text());
      }
    } catch (err) {
      console.error("Error verifying with backend:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (redirect: boolean = false) => {
    const currentSession = session ?? (await supabase.auth.getSession()).data.session;
    if (!currentSession) return;
    await verifyUserWithBackend(currentSession, { force: true, redirect });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/auth");
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, refreshUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
