import mongoose, { Schema, Document } from "mongoose";

// Interface for Message schema to define its Structure and type
export interface Message extends Document {
  content: string; // The content of the message
  createdAt: Date; // The timestamp of when the message was created
}

// Message Schema to store individual messages
const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String, // Stores the message as a string
    required: true, // Ensures the message content is always provided
  },
  createdAt: {
    type: Date, // Stores the timestamp of message creation
    required: true, // Ensures the timestamp is always provided
    default: Date.now, // Automatically sets the current date and time
  },
});

// Interface for User schema to define its structure and type
export interface User extends Document {
  username: string; // The unique name of the user
  email: string; // User's email address for identification
  password: string; // Hashed password for secure login
  verifyCode: string; // Verification code for email validation
  verifyCodeExpiry: Date; // Expiry date of the verification code
  isVerified: boolean; // Tracks if the user's email is verified
  isAcceptingMessage: boolean; // Indicates if the user accepts messages
  messages: Message[]; // Array of associated messages
}

// User Schema to store user data
const UserSchema: Schema<User> = new Schema({
  username: {
    type: String, // Stores the username as a string
    required: [true, "Username is required"], // Validation: Must provide a username
    trim: true, // Removes extra spaces from the username
    unique: true, // Ensures the username is unique across all users
  },
  email: {
    type: String, // Stores the email as a string
    required: [true, "Email is required"], // Validation: Must provide an email
    unique: true, // Ensures the email is unique
    match: [/.+\@.+\..+/, "Please fill a valid email address"], // Ensures email format is valid
  },
  password: {
    type: String, // Stores the password as a hashed string
    required: [true, "Password is required"], // Validation: Must provide a password
  },
  verifyCode: {
    type: String, // Stores the verification code
    required: [true, "Verify code is required"], // Validation: Must provide a code
  },
  verifyCodeExpiry: {
    type: Date, // Stores the expiry date of the verification code
    required: [true, "Verify code expiry is required"], // Validation: Must provide an expiry date
  },
  isVerified: {
    type: Boolean, // Stores verification status
    default: false, // Default: Not verified until email is confirmed
  },
  isAcceptingMessage: {
    type: Boolean, // Indicates if the user is open to receiving messages
    default: true, // Default: True, allowing messages initially
  },
  messages: [MessageSchema], // Embeds the MessageSchema to store user messages
});

// Creates the User model or retrieves it if already created
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

// Exports the User model for use in other parts of the application
export default UserModel;
