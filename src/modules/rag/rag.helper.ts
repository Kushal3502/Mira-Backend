import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PineconeStore } from "@langchain/pinecone";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embeddings } from "../../config/gemini";
import { llm } from "../../config/ollama";
import { pineconeIndex } from "../../config/pinecone";

export const RagHelper = {
  async indexDocument(filePath: string, chatbotId: string) {
    const pdfLoader = new PDFLoader(filePath);

    const rawDocs = await pdfLoader.load();

    console.log("PDF Loaded");

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

    console.log("Chunking completed");

    const enrichedDocs = chunkedDocs.map((doc) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        chatbotId,
        filePath,
      },
    }));

    console.log({ enrichedDocs });

    console.log("Embedding model loaded");

    console.log("Models configured");

    await PineconeStore.fromDocuments(enrichedDocs, embeddings, {
      pineconeIndex,
      namespace: chatbotId,
      maxConcurrency: 5,
    });

    console.log("Saved to database");
  },

  async retrieveDocument(chatbotId: string, message: string) {
    // Load vector store for this chatbot (namespace = chatbotId)
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: chatbotId,
    });

    // Similarity search --> it automatically creates embeddings
    const results = await vectorStore.similaritySearch(message, 3);

    if (!results.length) {
      return "I could not find relevant information in the uploaded documents.";
    }

    // Build context
    const context = results.map((doc) => doc.pageContent).join("\n\n");

    // Prompt
    const prompt = `
              You are an AI assistant that returns JSON only.

              RULES:
              - Use ONLY the context.
              - Do NOT add external knowledge.
              - If information is missing, return null for that field.
              - Return valid JSON only. No extra text.

              JSON SCHEMA:
              {
                "title": string,
                "sections": [
                  {
                    "heading": string,
                    "items": string[]
                  }
                ]
              }

              CONTEXT:
              ${context}

              QUESTION:
              ${message}

              JSON:
    `;

    console.log("prompt :: ", prompt);

    // const result = await chatModel.generateContent(prompt);

    const result = await llm.invoke(prompt);

    return result.content;
  },
};
