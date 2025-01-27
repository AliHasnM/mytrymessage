import { z } from "zod"; // Importing zod for schema validation

// Validation schema for user sign-up
export const signUpSchema = z.object({
    identifier: z.string(), // Ensures the identifier is a string (e.g., username or email)
    password: z.string() // Ensures the password is a string
});