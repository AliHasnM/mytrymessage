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
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // ❌ If user is not accepting messages, return 403 response
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
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
    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    log("Error sending message", error); // 🔹 Log error for debugging

    // ❌ Server error response
    return Response.json(
      {
        success: false,
        message: "Error sending message",
      },
      { status: 500 }
    );
  }
}

/*
  🔑 **Key Concepts Used:**
  ---------------------------------
  1️⃣ **Database Connection (`dbConnect()`)**  
      - MongoDB se connect hone ke liye async function.  
      
  2️⃣ **Handling HTTP POST Requests**  
      - request.json() se body parse karna.  
      
  3️⃣ **Database Query (`findOne()`)**  
      - `findOne()` se username ke basis pe user dhundhna.  

  4️⃣ **Error Handling & Response Codes**  
      - **404 (Not Found):** Jab user nahi milta.  
      - **403 (Forbidden):** Jab user messages accept nahi kar raha.  
      - **201 (Created):** Jab message successfully send ho jata hai.  
      - **500 (Internal Server Error):** Jab koi unexpected error hota hai.  

  5️⃣ **Data Validation & Security**  
      - Pehle check kiya jata hai ke user exist karta hai ya nahi.  
      - Phir check kiya jata hai ke user messages accept kar raha hai ya nahi.  
      - `try-catch` block se errors handle kiye gaye hain.  

  ✅ Yeh code ek **secure, efficient aur structured** approach follow karta hai jo best practices ko implement karta hai.
*/
