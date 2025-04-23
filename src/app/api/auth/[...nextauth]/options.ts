/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth"; // Importing NextAuth options type
import CredentialsProvider from "next-auth/providers/credentials"; // Importing credentials provider for username/password authentication
import bcrypt from "bcryptjs"; // Importing bcrypt for password hashing and comparison
import dbConnect from "@/lib/dbConnect.lib"; // Importing function to connect to MongoDB
import UserModel from "@/model/User.model"; // Importing User model to interact with the database

// Configuring authentication options for NextAuth
export const authOptions: NextAuthOptions = {
  // Defining authentication providers (only credentials provider is used here)
  providers: [
    CredentialsProvider({
      id: "credentials", // Unique identifier for this provider
      name: "Credentials", // Name of the provider
      credentials: {
        identifier: {
          label: "Username/Email", // Label for username or email input
          type: "email", // Input type (email)
          placeholder: "example@gmail.com", // Placeholder text for email input
        },
        password: {
          label: "Password", // Label for password input
          type: "password", // Input type (password)
        },
      },
      // Function that handles authentication logic
      async authorize(credentials: any): Promise<any> {
        await dbConnect(); // Ensuring database connection before querying

        try {
          // Checking if a user exists with the provided email or username
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier }, // Match by email
              { username: credentials.identifier }, // Match by username
            ],
          });

          // If no user is found, throw an error
          if (!user) {
            throw new Error("No user found with this email");
          }

          // Check if the user's email is verified before allowing login
          if (!user.isVerified) {
            throw new Error(
              "User is not verified. Please verify your account."
            );
          }

          // Comparing the provided password with the hashed password stored in the database
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          // If password is correct, return the user object
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Password is incorrect");
          }
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  // Callbacks to modify JWT token and session
  callbacks: {
    async jwt({ token, user }) {
      // If user object exists (meaning authentication was successful), add user details to token
      if (user) {
        token._id = user._id?.toString(); // Storing user ID in token
        token.username = user.username; // Storing username in token
        token.isVerified = user.isVerified; // Storing verification status in token
        token.email = user.email;
        token.isAcceptingMessages = user.isAcceptingMessages; // Storing message acceptance status in token
      }
      return token; // Return modified token
    },
    async session({ session, token }) {
      // If token exists, add user details to the session object
      if (token) {
        session.user._id = token._id; // Assigning user ID from token to session
        session.user.username = token.username; // Assigning username from token to session
        session.user.email = token.email;
        session.user.isVerified = token.isVerified; // Assigning verification status from token to session
        session.user.isAcceptingMessages = token.isAcceptingMessages; // Assigning message acceptance status from token to session
      }
      return session; // Return modified session object
    },
  },
  pages: {
    signIn: "/sign-in", // Custom sign-in page route
    error: "/sign-in", // ✅ Redirect to login page on error
  },
  session: {
    strategy: "jwt", // Using JWT-based sessions for authentication
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret key for encrypting JWT tokens (stored in environment variables)
};

/* 
  🔑 Key Concepts:
  1️⃣ Always connect to the database before querying (dbConnect()).
  2️⃣ Authentication flow: Find user → Check verification → Compare password.
  3️⃣ Error handling: Use try-catch to manage errors gracefully.
  4️⃣ Store essential user details in JWT to avoid unnecessary DB queries.
  5️⃣ Modify session using token data to provide user-specific details.
  6️⃣ Secure authentication with NextAuth secret for encryption.
*/
