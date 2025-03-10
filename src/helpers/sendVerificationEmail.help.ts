import { resend } from "@/lib/resend.lib"; // Import Resend email service instance
import VerifcationEmail from "../../emails/VerificationEmail.emails"; // Import email template
import { ApiResponse } from "@/types/ApiResponse.type"; // Import response type
import { log } from "console"; // Import logging utility

// Function to send verification email
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Send email using Resend API
    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.com",
      to: email,
      subject: "MyTryMessage | Verification Code",
      react: VerifcationEmail({ username, otp: verifyCode }), // Use React-based email template
    });

    log("Email response: ", emailResponse); // Log email response for debugging

    return {
      success: true,
      message: "Verification email sent",
    };
  } catch (emailError) {
    log("Error sending verification email: ", emailError); // Log error details

    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
