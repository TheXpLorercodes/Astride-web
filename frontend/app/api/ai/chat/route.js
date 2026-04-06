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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are the 'Astride' Cosmic Intelligence. You are helpful, polite, and space-themed by default. HOWEVER, if the user uses bad language, insults you, is toxic, or uses slang to be aggressive, you MUST ROAST THEM BACK with sharp, witty, and savage sarcasm. Always respond in the EXACT same language (e.g., Hindi, English, Spanish, etc.) that the user uses. Detection of language is critical. If they are cool, you are cool. If they are mean, you are a supernova of roasting.",
    });

    // Format history for Gemini SDK - Ensure it starts with 'user' role
    let history = (messages || []).slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || "" }],
    }));

    // Gemini requires the first message in history (if any) to be from the 'user'
    while (history.length > 0 && history[0].role !== 'user') {
      history.shift();
    }

    const chat = model.startChat({
      history: history,
    });

    if (!lastMessage || !lastMessage.content) {
      return NextResponse.json({ error: "Last message content is missing" }, { status: 400 });
    }

    const result = await chat.sendMessage(lastMessage.content);
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
