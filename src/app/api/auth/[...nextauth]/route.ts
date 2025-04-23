import NextAuth from "next-auth"; // Importing NextAuth for authentication
import { authOptions } from "./options";
// Importing authentication options from a separate file

const handler = NextAuth(authOptions); // Initializing NextAuth with the provided options

export { handler as GET, handler as POST }; // Handling both GET and POST requests for authentication

/* 
  🔑 Key Concepts:
  1️⃣ `NextAuth(authOptions)`: Initializes authentication using the provided config.
  2️⃣ Centralized `authOptions`: Keeps authentication logic separate and reusable.
  3️⃣ API Routes (`GET` & `POST`): Handles authentication requests dynamically.
  4️⃣ Ensures secure and modular authentication setup in a Next.js app.
*/
