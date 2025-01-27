import { z } from "zod"; // Importing ZOD for schema validation

// Validation schema for verifying a code
export const verifySchema = z.object({
    code: z
        .string() // Ensures the value is a string
        .length(6, "Verification code must be 6 characters long") // Checks that the code is exactly 6 characters
});
