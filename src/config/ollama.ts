import { ChatOllama } from "@langchain/ollama";

export const llm = new ChatOllama({
  model: "llama3.2:3b",
  temperature: 0,
  maxRetries: 2,
  streaming: false,
});
