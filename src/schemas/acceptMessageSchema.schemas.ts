import { z } from "zod"; // Importing ZOD for schema validation

// Validation schema for accepting messages
export const acceptMessageSchema = z.object({
    acceptMessages: z.boolean() // Ensures the field is a boolean (true/false)
});
