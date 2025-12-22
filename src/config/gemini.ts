import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "text-embedding-004",
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const chatModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});
