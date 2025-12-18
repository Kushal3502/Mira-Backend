import fs from "fs";
import path from "path";
import { supabase } from "../../config/supabase";
import { ApiError } from "../../utils";
import { ChatbotRepository } from "../chatbot/chatbot.repository";
import { RagHelper } from "./rag.helper";
import { RagRepository } from "./rag.repository";

export const RagService = {
  async uploadDocument(owner: string, chatbotId: string, filePath: string) {
    if (!owner) throw new ApiError(401, "Unauthorized");

    const chatbot = await ChatbotRepository.findById(owner, chatbotId);
    if (!chatbot) {
      throw new ApiError(404, "Chatbot not found.");
    }

    const existing = await RagRepository.findByPath(chatbotId, filePath);
    if (existing) {
      throw new ApiError(409, "Document already uploaded");
    }

    return RagRepository.createDocument({
      chatbotId,
      filePath,
    });
  },

  async getDocumentUrl(owner: string, chatbotId: string, documentId: string) {
    if (!owner) throw new ApiError(401, "Unauthorized");

    const doc = await RagRepository.findById(documentId);
    if (!doc) throw new ApiError(404, "Document not found");

    const chatbot = await ChatbotRepository.findById(owner, chatbotId);
    if (!chatbot) throw new ApiError(403, "Forbidden");

    const { data, error } = await supabase.storage
      .from("Mira")
      .createSignedUrl(doc.filePath, 60 * 5);

    if (error) throw error;

    return data.signedUrl;
  },
  
  async generateEmbeddings(filePath: string) {
    const { data, error } = await supabase.storage
      .from("Mira")
      .createSignedUrl(filePath, 60 * 10);

    if (error) throw error;

    const signedUrl = data.signedUrl;

    const pdfResponse = await fetch(signedUrl);

    if (!pdfResponse.ok) {
      throw new Error("Failed to download PDF");
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

    const tempDir = path.join(__dirname, "../../../public/temp");

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    let tempPath: string = path.join(tempDir, `${Date.now()}.pdf`);

    try {
      fs.writeFileSync(tempPath, pdfBuffer);
      await RagHelper.indexDocument(tempPath);
    } finally {
      if (tempPath && fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  },
};
