import { getServerSession } from "next-auth"; // ✅ Import function to get the user's session
import { authOptions } from "../auth/[...nextauth]/options"; // ✅ Import authentication options for session management
import dbConnect from "@/lib/dbConnect.lib"; // ✅ Import database connection utility
import UserModel from "@/model/User.model"; // ✅ Import User model from Mongoose schema
import { User } from "next-auth"; // ✅ Import NextAuth User type
import mongoose from "mongoose"; // ✅ Import Mongoose for database operations
import { log } from "console"; // ✅ Import log function for debugging

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  await dbConnect(); // 🔹 Ensure the database connection before querying

  // 🔹 Get the user session using NextAuth
  const session = await getServerSession(authOptions);
  const loggedInUser: User | null = session?.user as User; // 🔹 Extract logged-in user details

  // 🔹 Check if user is authenticated
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message:
          "Not Authenticated. You must be logged in to access this resource.",
      },
      { status: 401 } // ❌ 401: Unauthorized - User is not authenticated
    );
  }

  const userId = new mongoose.Types.ObjectId(loggedInUser._id); // 🔹 Convert string user ID to Mongoose ObjectId

  try {
    // 🔹 MongoDB Aggregation Pipeline to get sorted messages for the user
    const userMessages = await UserModel.aggregate([
      { $match: { _id: userId } }, // 🔹 Find the user by ID
      {
        $unwind: {
          path: "$messages",
          preserveNullAndEmptyArrays: true, // ✅ Prevent filtering out users with no messages
        },
      },
      { $sort: { "messages.createdAt": -1 } }, // 🔹 Sort messages by newest first
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" }, // 🔹 Collect all messages into an array
        },
      },
    ]);

    // 🔹 Handle case when no messages are found
    if (
      !userMessages ||
      userMessages.length === 0 ||
      !userMessages[0].messages.length
    ) {
      return Response.json(
        {
          success: false,
          message: "No messages found for the user.",
        },
        { status: 404 } // ❌ 404: Not Found - No messages found for
      );
    }

    // 🔹 Return retrieved messages
    return Response.json(
      {
        success: true,
        messages: userMessages[0].messages,
      },
      { status: 200 } // ✅ 200: OK - Successful response
    );
  } catch (error) {
    log("Error getting messages for user: ", error); // 🔹 Log error for debugging

    // 🔹 Handle unexpected server errors
    return Response.json(
      {
        success: false,
        message: "Unexpected server error",
      },
      { status: 500 } // ❌ 500: Internal Server Error - Unexpected issue
    );
  }
}

/*
  🔑 **Key Concepts & Fixes:**
  ---------------------------------
  1️⃣ **Database Connection:** Ensure database is connected before querying (`await dbConnect()`).
  2️⃣ **Authentication Check:** Uses `getServerSession(authOptions)` to verify if user is logged in.
  3️⃣ **Mongoose Aggregation Pipeline:**
      - `$match`: Find the user by `_id`.
      - `$unwind`: Extract messages while keeping users with no messages (`preserveNullAndEmptyArrays: true`).
      - `$sort`: Sort messages in descending order (latest first).
      - `$group`: Collect messages into an array for the user.
  4️⃣ **Handling No Messages:** Ensures response is correctly handled if the user has no messages.
  5️⃣ **Fixed Response Format:** Used `Response.json({},{}))`.
  6️⃣ **Fixed Variable Name Conflict:** Changed `user` in `try` block to `userMessages` to avoid overwriting the session user.
  7️⃣ **Error Handling:** Proper error logging and response messages.

  ✅ Now the API follows Next.js best practices, ensures database integrity, and provides accurate error handling.
*/
