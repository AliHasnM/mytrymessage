import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect.lib";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { messageid: string } }
) {
  const { messageid } = params;

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Not Authenticated. You must be logged in to access this resource.",
      },
      { status: 401 }
    );
  }

  try {
    const updatedUser = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    if (updatedUser.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found or already deleted.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}
