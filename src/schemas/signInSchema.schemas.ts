import { z } from "zod"; // Importing zod for schema validation

export const signInSchema = z.object({
  identifier: z
    .string()
    .min(3, "Identifier must be at least 3 characters long")
    .refine((val) => val.includes("@") || /^[a-zA-Z0-9_.]+$/.test(val), {
      message: "Must be a valid email or username",
    }), // Ensures it's an email or a valid username
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Validation schema for user sign-up
// export const signInSchema = z.object({
//   identifier: z.string(), // Ensures the identifier is a string (e.g., username or email)
//   password: z.string(), // Ensures the password is a string
// });
