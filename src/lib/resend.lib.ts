import { Resend } from "resend";

// Initialize Resend API instance using the API key from environment variables  
export const resend = new Resend(process.env.RESEND_API_KEY);
