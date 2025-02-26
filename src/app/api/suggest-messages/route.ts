import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { log } from "console";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage frindenly interaction. For exmaple, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriging, foster curiosity, and contribute to a positive and welcoming conversational environment.'";

    const result = streamText({
      model: openai("gpt-4o"),
      prompt,
    });

    return result.toDataStreamResponse();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.response) {
      // Agar API error hai to response se status aur message nikal lo
      return NextResponse.json(
        {
          success: false,
          error: error.response.data || "API error occurred",
        },
        { status: error.response.status || 500 }
      );
    } else {
      log("An unexpected error occurred", error);
      return NextResponse.json(
        {
          success: false,
          error: "An unexpected error occurred",
        },
        { status: 500 }
      );
    }
  }
}
