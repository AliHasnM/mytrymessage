import "next-auth"; // ✅ Extends NextAuth's built-in types
import { DefaultSession } from "next-auth"; // ✅ Imports default session structure

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
  }

  interface Session {
    user: {
      _id?: string;
      username?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
    } & DefaultSession["user"]; // ✅ Extends the default user session type
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
  }
}

/* 
  🔑 Key Concepts:
  1️⃣ `declare module "next-auth"`: Extends built-in NextAuth types.
  2️⃣ `User interface`: Adds custom fields (_id, username, etc.) to NextAuth User.
  3️⃣ `Session interface`: Extends NextAuth session to include custom user fields.
  4️⃣ `DefaultSession["user"]`: Ensures compatibility with NextAuth's default user type.
  5️⃣ `declare module "next-auth/jwt"`: Extends JWT structure to store custom user data.
  6️⃣ Allows custom properties (e.g., `isVerified`, `isAcceptingMessages`) to persist across authentication flows.
*/
