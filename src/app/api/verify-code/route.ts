import dbConnect from "@/lib/dbConnect.lib";
import UserModel from "@/model/User.model";
import { log } from "console";

export async function POST(request: Request) {
  await dbConnect(); // ✅ Connect to the database

  try {
    const { username, code } = await request.json(); // ✅ Extract username and verification code

    const decodedUsername = decodeURIComponent(username); // ✅ Decode the username from the request
    const user = await UserModel.findOne({ username: decodedUsername }); // ✅ Find the user in the database

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 } // ✅ 404: Not Found - User does not exist
      );
    }

    const isCodeValid = user.verifyCode === code; // ✅ Check if the provided verification code matches
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date(); // ✅ Ensure the code is not expired

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true; // ✅ Mark user as verified
      await user.save(); // ✅ Save the updated user data

      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 } // ✅ 200: OK - Successful verification
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid code, Please try again",
        },
        { status: 400 } // ✅ 400: Bad Request - Incorrect verification code
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code has expired, Please request a new one",
        },
        { status: 400 } // ✅ 400: Bad Request - Expired verification code
      );
    }
  } catch (error) {
    log("Error verifying code for user verification: ", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying code for user verification",
      },
      { status: 500 } // ✅ 500: Internal Server Error - General error handling
    );
  }
}

/* 
  🔑 Key Concepts:
  1️⃣ `dbConnect()`: Connects to MongoDB before handling requests.
  2️⃣ `decodeURIComponent(username)`: Decodes the username from the request.
  3️⃣ `UserModel.findOne()`: Searches for the user in the database.
  4️⃣ `verifyCode === code`: Checks if the provided verification code matches the stored one.
  5️⃣ `new Date(user.verifyCodeExpiry) > new Date()`: Ensures the code is still valid.
  6️⃣ If valid, marks user as verified and saves changes.
  7️⃣ Returns appropriate HTTP status codes:
     - `200`: Success
     - `400`: Bad Request (Invalid or expired code)
     - `404`: Not Found (User does not exist)
     - `500`: Server Error (Unexpected issue)
*/
