import fs from "fs";
import { Cloudinary } from "../../helpers/cloudinary";
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

    const pdf = await Cloudinary.uploadDocument(filePath);

    pdf && (await RagHelper.indexDocument(filePath));

    fs.unlinkSync(filePath);

    return RagRepository.createDocument({
      chatbotId,
      fileName: pdf?.original_filename,
      url: pdf?.secure_url,
      fileSize: pdf?.bytes,
    });
  },
};
