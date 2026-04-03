import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request) {
  const { messages } = await request.json();
  const lastMessage = messages[messages.length - 1];

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
    return NextResponse.json({ 
      text: "I'm currently in static mode because the Gemini API key is not configured. Please add your key to `.env.local` to enable real-time cosmic intelligence!" 
    });
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent(lastMessage.content);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json({ text });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
