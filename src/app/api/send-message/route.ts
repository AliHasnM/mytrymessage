import dbConnect from "@/lib/dbConnect.lib"; // ✅ Database connection
import UserModel, { Message } from "@/model/User.model"; // ✅ Import User model
import { log } from "console"; // ✅ For debugging

export async function POST(request: Request) {
  await dbConnect(); // 🔹 Ensure database connection

  try {
    // 🔹 Parse JSON request body
    const { username, content } = await request.json();

    // 🔹 Find the user in database using username
    const user = await UserModel.findOne({ username });

    // ❌ If user is not found, return 404 response
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        { status: 404 }
      );
    }

    // ❌ If user is not accepting messages, return 403 response
    if (!user.isAcceptingMessage) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User is not accepting messages",
        }),
        { status: 403 }
      );
    }

    // ✅ Properly create a new message object following Mongoose schema
    const newMessage = {
      content,
      createdAt: new Date(),
    };

    // 🔹 Push the new message into user's messages array
    user.messages.push(newMessage as Message);

    // 🔹 Save updated user document
    await user.save();

    // ✅ Successfully sent message response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Message sent successfully",
      }),
      { status: 201 }
    );
  } catch (error) {
    log("Error sending message", error); // 🔹 Log error for debugging

    // ❌ Server error response
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error sending message",
      }),
      { status: 500 }
    );
  }
}
