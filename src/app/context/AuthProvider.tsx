'use client' // ✅ Ensures this component runs only on the client side

import { SessionProvider } from "next-auth/react"; // ✅ Provides session context for authentication

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

/* 
  🔑 Key Concepts:
  1️⃣ `'use client'`: Marks this as a client component (Next.js 13+).
  2️⃣ `SessionProvider`: Wraps the app with NextAuth session context.
  3️⃣ Allows access to `useSession()` & `getSession()` anywhere in the app.
  4️⃣ Ensures authentication state is maintained across components.
  5️⃣ Essential for handling user authentication in Next.js apps.
*/
