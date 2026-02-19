import type { User } from "firebase/auth";

export function apiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) {
    throw new Error("missing_NEXT_PUBLIC_API_BASE_URL");
  }
  return url.replace(/\/$/, "");
}

export async function apiFetch(inputPath: string, init: RequestInit = {}, user?: User | null) {
  const url = `${apiBaseUrl()}${inputPath.startsWith("/") ? "" : "/"}${inputPath}`;

  const headers = new Headers(init.headers);
  headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");

  if (user) {
    const token = await user.getIdToken();
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...init,
    headers,
  });
}
