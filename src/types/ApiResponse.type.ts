import { Message } from "@/model/User.model";

// Defines the structure of API responses for consistency
export interface ApiResponse {
  success: boolean; // Indicates if the API request was successful
  message: string; // Describes the API response (success or error message)
  isAcceptingMessage?: boolean; // Optional: Tracks if a user is accepting messages
  messages?: Array<Message>; // Optional: Contains a list of messages if applicable
}
