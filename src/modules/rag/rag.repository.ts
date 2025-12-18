import { Documents } from "./rag.model";

export const RagRepository = {
  createDocument: (payload: object) => {
    return Documents.create(payload);
  },
  findById: (documentId: string) => {
    return Documents.findById(documentId);
  },
  findByChatbot: (chatbotId: string) => {
    return Documents.find({
      chatbotId,
    });
  },
  findByPath: (chatbotId: string, filePath: string) => {
    return Documents.findOne({
      chatbotId,
      filePath,
    });
  },
};
