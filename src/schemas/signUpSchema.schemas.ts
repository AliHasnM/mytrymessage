import { z } from "zod"; // Importing zod for schema validation

// Validation for the `username` field
export const usernameValidation = z
    .string() // Ensures the value is a string
    .min(2, "Username must be at least 2 characters") // Minimum length validation
    .max(20, "Username no more than 20 characters") // Maximum length validation
    .regex(/^[a-zA-Z0-9_]+$/, "Username cannot contain special characters"); // Restricts special characters, allowing only alphanumeric and underscores

// Validation schema for user sign-up
export const signUpSchema = z.object({
    username: usernameValidation, // Uses predefined username validation rules
    email: z.string().email({ message: "Invalid email address" }), // Validates email format
    password: z
        .string() // Ensures the value is a string
        .min(6, { message: "Password must be at least 6 characters" }) // Minimum length validation
});
