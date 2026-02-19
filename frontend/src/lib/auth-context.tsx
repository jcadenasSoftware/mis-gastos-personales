"use client";

import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getAuthSafe, getGoogleProviderSafe } from "./firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => Boolean(getAuthSafe()));

  useEffect(() => {
    const a = getAuthSafe();
    if (!a) {
      return;
    }

    const unsub = onAuthStateChanged(a, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      loginWithGoogle: async () => {
        const auth = getAuthSafe();
        if (!auth) {
          throw new Error("firebase_not_configured");
        }
        const provider = getGoogleProviderSafe();
        if (!provider) {
          throw new Error("firebase_not_configured");
        }
        await signInWithPopup(auth, provider);
      },
      logout: async () => {
        const auth = getAuthSafe();
        if (!auth) {
          return;
        }
        await signOut(auth);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth_must_be_used_within_AuthProvider");
  }
  return ctx;
}
