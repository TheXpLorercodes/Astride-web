import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;
const requestBuckets = new Map();

function createJsonResponse(body, init = {}) {
  const headers = new Headers(init.headers);
  headers.set('Cache-Control', 'no-store');
  return NextResponse.json(body, { ...init, headers });
}

function getClientKey(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  return forwardedFor?.split(',')[0]?.trim() || realIp || cfConnectingIp || 'anonymous';
}

function enforceRateLimit(request) {
  const clientKey = getClientKey(request);
  const now = Date.now();

  for (const [key, bucket] of requestBuckets.entries()) {
    if (now - bucket.startedAt >= RATE_LIMIT_WINDOW_MS) {
      requestBuckets.delete(key);
    }
  }

  const bucket = requestBuckets.get(clientKey);
  if (!bucket || now - bucket.startedAt >= RATE_LIMIT_WINDOW_MS) {
    requestBuckets.set(clientKey, { count: 1, startedAt: now });
    return null;
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      retryAfter: Math.max(1, Math.ceil((bucket.startedAt + RATE_LIMIT_WINDOW_MS - now) / 1000)),
    };
  }

  bucket.count += 1;
  return null;
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return null;
  }

  const normalized = [];

  for (const message of messages) {
    if (!message || typeof message !== 'object') {
      return null;
    }

    const role = typeof message.role === 'string' ? message.role.toLowerCase() : '';
    if (role !== 'user' && role !== 'assistant' && role !== 'model') {
      return null;
    }

    const content = typeof message.content === 'string' ? message.content.trim() : '';
    if (!content || content.length > MAX_MESSAGE_LENGTH) {
      return null;
    }

    normalized.push({
      role: role === 'assistant' ? 'model' : role,
      parts: [{ text: content }],
    });
  }

  return normalized;
}

export async function POST(request) {
  try {
    const rateLimit = enforceRateLimit(request);
    if (rateLimit) {
      return createJsonResponse(
        { error: "Too many requests. Please wait and try again." },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter),
          },
        }
      );
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return createJsonResponse({ error: "Invalid JSON body." }, { status: 400 });
    }

    const normalizedMessages = normalizeMessages(payload?.messages);
    if (!normalizedMessages) {
      return createJsonResponse({ error: "Invalid message history provided." }, { status: 400 });
    }

    const lastMessage = normalizedMessages[normalizedMessages.length - 1];

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
      return createJsonResponse(
        {
          error: "Cosmic Connection Offline: The Gemini API key is missing from environment settings.",
        },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are the 'Astride' Cosmic Intelligence. Be helpful, polite, concise, and space-themed. If the user is rude or hostile, stay calm, de-escalate, and remain professional. Always respond in the exact same language as the user.",
    });

    const lastMessageContent = lastMessage.parts[0].text;

    // Format history for Gemini SDK - Ensure it starts with 'user' role
    let history = normalizedMessages.slice(0, -1);

    // Gemini requires the first message in history (if any) to be from the 'user'
    while (history.length > 0 && history[0].role !== 'user') {
      history.shift();
    }

    const chat = model.startChat({ history });

    const result = await chat.sendMessage(lastMessageContent);
    const response = await result.response;
    const text = response.text();
    return createJsonResponse({ text });
  } catch (err) {
    console.error('[AI CHAT ERROR]:', err);
    return createJsonResponse({
      error: "The celestial link encountered an error. Please verify your API key and connection.",
    }, { status: 500 });
  }
}
