'use client' // ✅ Ensures this component runs only on the client side
import { useSession, signIn, signOut } from "next-auth/react"; // ✅ Import NextAuth hooks for authentication

export default function Component() {
  const { data: session } = useSession(); // ✅ Get session data (user authentication state)

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button> {/* ✅ Logs out the user */}
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button className="bg-orange-500 py-1 px-3 m-4 rounded-md" onClick={() => signIn()}>
        Sign in
      </button> {/* ✅ Logs in the user */}
    </>
  );
}

/* 
  🔑 Key Concepts:
  1️⃣ `'use client'`: Makes this a client component (Next.js 13+).
  2️⃣ `useSession()`: Retrieves authentication state (session data).
  3️⃣ `signIn()`: Triggers the NextAuth sign-in flow.
  4️⃣ `signOut()`: Logs out the user and clears the session.
  5️⃣ Conditional rendering:
     - Shows user email & logout button if logged in.
     - Shows login button if not authenticated.
  6️⃣ Can be used in headers, navigation bars, or protected pages.
*/
