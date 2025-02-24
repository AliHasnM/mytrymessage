import dbConnect from "@/lib/dbConnect.lib"; // ✅ Connects to the database
import UserModel from "@/model/User.model"; // ✅ Mongoose model for user data
import { z } from "zod"; // ✅ Validation library for runtime data validation
import { usernameValidation } from "@/schemas/signUpSchema.schemas"; // ✅ Username validation rules
import { log } from "console"; // ✅ Logging for debugging

// ✅ Define Zod schema for query parameter validation
const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect(); // ✅ Establish database connection

  try {
    // ✅ Extract query parameters from request URL
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    // ✅ Validate query parameters using Zod
    const result = UsernameQuerySchema.safeParse(queryParams);
    log("result: ", result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "Invalid username or query parameter",
        },
        { status: 400 }
      );
    }

    // ✅ Check if the username already exists and is verified
    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }

    // ✅ Username is unique and available
    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    log("Error checking username uniqueness: ", error);

    return Response.json(
      {
        success: false,
        error: "Error checking username uniqueness",
      },
      { status: 500 }
    );
  }
}

/* 
  🔑 Key Concepts:
  1️⃣ `dbConnect()`: Ensures the database is connected before queries.
  2️⃣ `Zod Validation (safeParse)`: Validates input query parameters before processing.
  3️⃣ `searchParams.get("username")`: Extracts username from request query.
  4️⃣ `UserModel.findOne()`: Checks if the username already exists and is verified.
  5️⃣ Error Handling: Returns appropriate responses for invalid input, duplicate usernames, and server errors.
  6️⃣ Logs (`log()`): Helps debug request processing and validation issues.
*/
