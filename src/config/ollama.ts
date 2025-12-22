import { ChatOllama } from "@langchain/ollama";

export const llm = new ChatOllama({
  model: "mistral",
  temperature: 0,
  maxRetries: 2,
  streaming: false,
});
