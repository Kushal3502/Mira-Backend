import { ApiError } from "../../utils";
import { ChatbotRepository } from "./chatbot.repository";

export const ChatbotService = {
  async addChatbot(owner: string, data: any) {
    if (!owner) throw new ApiError(401, "Unauthorized");

    const { name, description, logo } = data;

    if (!name) {
      throw new ApiError(400, "Please provide a name");
    }

    const exists = await ChatbotRepository.findByName(name, owner);
    if (exists) {
      throw new ApiError(
        400,
        "Chatbot already exists with this name. Please choose a unique one.",
      );
    }

    return ChatbotRepository.createChatbot({
      name,
      description,
      logo,
      owner,
    });
  },

  fetchChatbots(owner: string) {
    if (!owner) throw new ApiError(401, "Unauthorized");

    return ChatbotRepository.findByOwner(owner);
  },

  async getChatbot(owner: string, id: string) {
    if (!owner) throw new ApiError(401, "Unauthorized");

    const chatbot = await ChatbotRepository.findById(owner, id);

    if (!chatbot) {
      throw new ApiError(404, "Chatbot not found.");
    }

    return chatbot;
  },

  async deleteChatbot(owner: string, id: string) {
    if (!owner) throw new ApiError(401, "Unauthorized");

    const chatbot = await ChatbotRepository.findById(owner, id);

    if (!chatbot) {
      throw new ApiError(404, "Chatbot not found.");
    }

    return ChatbotRepository.deleteById(id, owner);
  },

  async updateChatbot(owner: string, chatbotId: string, data: any) {
    if (!owner) throw new ApiError(401, "Unauthorized");

    const { name, logo, description } = data;

    if (!name && !logo && !description) {
      throw new ApiError(400, "Please provide at least one field to update.");
    }

    const chatbot = await ChatbotRepository.findById(owner, chatbotId);
    if (!chatbot) {
      throw new ApiError(404, "Chatbot not found.");
    }

    if (name && name !== chatbot.name) {
      const existing = await ChatbotRepository.findByName(name, owner);
      if (existing) {
        throw new ApiError(400, "Chatbot name already exists. Choose another.");
      }
    }

    const updatePayload: any = {};
    if (name) updatePayload.name = name;
    if (logo) updatePayload.logo = logo;
    if (description) updatePayload.description = description;

    return ChatbotRepository.updateById(chatbotId, owner, updatePayload);
  },
};
