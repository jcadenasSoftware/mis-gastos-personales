"use client";

import Link from "next/link";

import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { user, loading, loginWithGoogle, logout } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex max-w-xl flex-col gap-6 px-6 py-16">
        <h1 className="text-3xl font-semibold">Mis Gastos Personales</h1>

        {loading ? (
          <p className="text-zinc-600">Cargando...</p>
        ) : user ? (
          <div className="flex flex-col gap-4">
            <p className="text-zinc-700">Sesión iniciada como: {user.email}</p>
            <div className="flex gap-3">
              <Link
                href="/"
                className="rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800"
              >
                Ir al dashboard
              </Link>
              <button
                onClick={() => logout()}
                className="rounded-md border border-zinc-300 px-4 py-2 hover:bg-white"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-zinc-700">Inicia sesión para continuar.</p>
            <button
              onClick={() => loginWithGoogle()}
              className="rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800"
            >
              Continuar con Google
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
