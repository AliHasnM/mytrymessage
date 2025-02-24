import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect.lib";
import { User } from "next-auth";
import { log } from "console";

export async function POST(request: Request) {
  await dbConnect(); // ✅ Connect to the database

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User; // ✅ Extract user session

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message:
          "Not Authenticated. You must be logged in to update user status.",
      },
      { status: 401 } // ✅ 401: Unauthorized - User not authenticated
    );
  }

  const userId = user?._id;
  const { acceptMessages } = await request.json(); // ✅ Extract `acceptMessages` from request body

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages }, // ✅ Fixed key name: `isAcceptingMessages`
      { new: true } // ✅ Return the updated document
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found. Update failed.",
        },
        { status: 404 } // ✅ 404: Not Found - User does not exist
      );
    }

    return Response.json(
      {
        success: true,
        message: "User message acceptance status updated successfully.",
        updatedUser,
      },
      { status: 200 } // ✅ 200: OK - Successfully updated user status
    );
  } catch (error) {
    log("Error updating user status for accepting messages: ", error);
    return Response.json(
      {
        success: false,
        message: "Server error: Failed to update user status.",
      },
      { status: 500 } // ✅ 500: Internal Server Error - Unexpected issue
    );
  }
}

/*
  🔑 Key Fixes & Concepts:
  1️⃣ `isAcceptingMessages`: Fixed incorrect field name in update query.
  2️⃣ `401 Unauthorized`: Returned when the user is not authenticated.
  3️⃣ `404 Not Found`: Returned when the user is not found in the database.
  4️⃣ `500 Server Error`: Handles unexpected issues during database update.
  5️⃣ `await dbConnect()`: Ensures database connection before processing the request.
  6️⃣ `{ new: true }`: Ensures we return the updated user document.
*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  await dbConnect(); // ✅ Ensure database connection

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated. You must be logged in to get user status.",
      },
      { status: 401 } // ✅ 401: Unauthorized - User is not authenticated
    );
  }

  const userId = user?._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 } // ✅ 404: Not Found - User does not exist
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage, // ✅ Fixed key name
      },
      { status: 200 } // ✅ 200: OK - Successfully retrieved user status
    );
  } catch (error) {
    log("Error fetching user status for accepting messages: ", error);
    return Response.json(
      {
        success: false,
        message: "Server error: Failed to get user status.",
      },
      { status: 500 } // ✅ 500: Internal Server Error - Unexpected issue
    );
  }
}

/*
    🔑 Key Fixes & Concepts:
    1️⃣ `isAcceptingMessages`: Fixed incorrect key in response.
    2️⃣ `message`: Used for error messages instead of `isAcceptingMessage`.
    3️⃣ `401 Unauthorized`: When the user is not authenticated.
    4️⃣ `404 Not Found`: When the user is not found in the database.
    5️⃣ `500 Server Error`: Handles unexpected issues.
    6️⃣ `await dbConnect()`: Ensures the database connection is established.
  */
