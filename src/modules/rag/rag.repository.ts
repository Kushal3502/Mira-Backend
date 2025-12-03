import { Documents } from "./rag.model";

export const RagRepository = {
  createDocument: (payload: object) => {
    return Documents.create(payload);
  },
  findByChatbot: (chatbotId: string) => {
    return Documents.find({
      chatbotId,
    });
  },
};
