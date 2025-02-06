import dbConnect from "@/lib/dbConnect.lib"; // Connects to the database
import UserModel from "@/model/User.model"; // Imports User schema/model
import bcrypt from "bcryptjs"; // Library for hashing passwords
import { log } from "console";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail.help"; // Utility function to send verification email

// Handles POST request for user registration
export async function POST(request: Request) { 
    await dbConnect(); // Ensures DB connection is established before proceeding
    try {
        // Extract user input from the request body
        const { username, email, password } = await request.json();

        // Check if a verified user with the same username already exists
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true // Ensures only verified users are considered
        });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "User already exists"
                },
                { status: 400 }
            );
        }

        // Check if an account with the same email exists (verified or unverified)
        const existingUserByEmail = await UserModel.findOne({ email });

        // Generate a 6-digit verification code for email verification
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                // Prevents duplicate account creation if the email is already verified
                return Response.json(
                    {
                        success: false,
                        message: "User already exists"
                    },
                    { status: 400 }
                );
            } else {
                // If user exists but is unverified, update their password and verification code
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // Code expires in 1 hour

                await existingUserByEmail.save(); // Save updated user data
            }
        } else {
            // If user does not exist, create a new one
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1); // Set verification expiry time

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false, // New users must verify email before logging in
                isAcceptingMessages: true, // Enables in-app messaging (if applicable)
                messages: [] // Placeholder for user messages
            });
            await newUser.save(); // Save the new user in the database
        }

        // Send verification email with the generated code
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message // Returns email error message
                },
                { status: 500 }
            );
        }

        // Successful user creation response
        return Response.json(
            {
                success: true,
                message: "User created successfully. Please verify your email"
            },
            { status: 201 }
        );
    } catch (error) {
        log("Error Registering User: ", error); // Logs errors for debugging
        return Response.json(
            {
                success: false,
                message: "Failed to create user"
            },
            { status: 500 }
        );
    }
}
