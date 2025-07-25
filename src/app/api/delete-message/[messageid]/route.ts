import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect.lib";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  context: { params: { messageid: string } }
) {
  const { messageid } = context.params; // Await the params first to ensure it's resolved
  const messageId = messageid;
  await dbConnect(); // 🔹 Ensure database connection

  const session = await getServerSession(authOptions);
  const user: User | null = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message:
          "Not Authenticated. You must be logged in to access this resource.",
      },
      { status: 401 }
    );
  }

  try {
    // Find user and remove the message from their messages array
    const updatedUser = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    // If user not found or message not removed, return error
    if (updatedUser.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already delete.",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting message:", error);

    return Response.json(
      {
        success: false,
        message: "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}

/*
  🗑️ **Delete Message API Route**
  ---------------------------------
  **🔹 Overview:**  
  - Deletes a message from the user's messages array in the database.
  - Requires authentication via `getServerSession(authOptions)`.
  - Uses MongoDB `$pull` operator to remove a message.

  **🛠️ Key Functionality:**  
  1️⃣ **Database Connection**  
      - `await dbConnect();` ensures MongoDB connection before query execution.  

  2️⃣ **Authentication Check**  
      - Uses `getServerSession(authOptions)` to retrieve the user session.  
      - If no session is found, it returns a `401 Unauthorized` response.  

  3️⃣ **Deleting the Message**  
      - `UserModel.updateOne({ _id: user._id }, { $pull: { messages: { _id: messageId } } })`  
        ➝ Removes the message from the `messages` array of the authenticated user.  

  4️⃣ **Handling Deletion Failure**  
      - If `modifiedCount === 0`, it means no message was found to delete, returning `404 Not Found`.  

  5️⃣ **Error Handling**  
      - Logs unexpected errors and responds with `500 Internal Server Error`.  

  ✅ **Security & Best Practices:**  
  - Ensures user authentication before modification.  
  - Uses `$pull` operator for atomic message deletion.  
  - Returns appropriate HTTP status codes.  
*/
