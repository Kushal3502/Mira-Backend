import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PineconeStore } from "@langchain/pinecone";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embeddings } from "../../config/gemini";
import { pineconeIndex } from "../../config/pinecone";

export const RagHelper = {
  async indexDocument(filePath: string) {
    const pdfLoader = new PDFLoader(filePath);

    const rawDocs = await pdfLoader.load();

    console.log("PDF Loaded");

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

    console.log("Chunking completed");

    console.log("Embedding model loaded");

    console.log("Models configured");

    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
      pineconeIndex,
      maxConcurrency: 5,
    });

    console.log("Saved to database");
  },
};
