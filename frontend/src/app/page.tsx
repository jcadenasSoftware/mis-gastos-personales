"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [health, setHealth] = useState<string>("");
  const [healthError, setHealthError] = useState<string>("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!user) {
        return;
      }
      try {
        setHealthError("");
        const res = await apiFetch("/health", { method: "GET" }, user);
        const json = (await res.json()) as { status?: string };
        if (!cancelled) {
          setHealth(json.status ?? "unknown");
        }
      } catch (e) {
        if (!cancelled) {
          setHealthError(e instanceof Error ? e.message : String(e));
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <main className="mx-auto max-w-xl px-6 py-16">
          <p className="text-zinc-600">Cargando...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex max-w-xl flex-col gap-6 px-6 py-16">
        <h1 className="text-3xl font-semibold">Dashboard</h1>

        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-zinc-700">Usuario: {user.email}</p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="font-medium">Backend health</p>
          {healthError ? (
            <p className="mt-2 text-sm text-red-600">{healthError}</p>
          ) : (
            <p className="mt-2 text-sm text-zinc-700">status: {health || "(sin dato)"}</p>
          )}
        </div>

        <div>
          <button
            onClick={() => logout()}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 hover:bg-zinc-50"
          >
            Cerrar sesión
          </button>
        </div>
      </main>
    </div>
  );
}
