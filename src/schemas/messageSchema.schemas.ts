import { z } from "zod"; // Importing ZOD for schema validation

// Validation schema for a message
export const MessageSchema = z.object({
    content: z
        .string() // Ensures the content is a string
        .min(10, { message: "Content must be at least 10 characters" }) // Validates minimum length
        .max(300, { message: "Content no more than 300 characters" }) // Validates maximum length
});
