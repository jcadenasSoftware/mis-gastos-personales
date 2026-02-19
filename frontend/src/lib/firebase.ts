import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

function hasFirebaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  );
}

function getAppSafe(): FirebaseApp | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (!hasFirebaseEnv()) {
    return null;
  }

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  return getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
}

export function getAuthSafe(): Auth | null {
  const app = getAppSafe();
  return app ? getAuth(app) : null;
}

export function getGoogleProviderSafe(): GoogleAuthProvider | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (!hasFirebaseEnv()) {
    return null;
  }
  return new GoogleAuthProvider();
}
