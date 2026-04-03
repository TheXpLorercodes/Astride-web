import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request) {
  try {
    const { messages } = await request.json();
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }
    
    const lastMessage = messages[messages.length - 1];

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
      return NextResponse.json({ 
        text: "Cosmic Connection Offline: The Gemini API key is missing from Vercel/Environment settings. Please add your key to enable real-time cosmic intelligence!" 
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(lastMessage.content);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json({ text });
  } catch (err) {
    console.error('[AI CHAT ERROR]:', err);
    return NextResponse.json({ 
      error: "The celestial link encountered an error. Please verify your API key and connection.",
      details: err.message 
    }, { status: 500 });
  }
}
