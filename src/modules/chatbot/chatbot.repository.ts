import { Chatbot } from "./chatbot.model";

export const ChatbotRepository = {
  findByName: (name: string, owner: string | undefined) => {
    return Chatbot.findOne({
      name,
      owner,
    });
  },

  createChatbot: (payload: object) => {
    return Chatbot.create(payload);
  },

  findByOwner: (owner: string) => {
    return Chatbot.find({ owner });
  },

  findById: (owner: string, chatbotId: string) => {
    return Chatbot.findOne({ _id: chatbotId, owner });
  },

  deleteById: (chatbotId: string, owner: string) => {
    return Chatbot.findOneAndDelete({ _id: chatbotId, owner });
  },

  updateById: (chatbotId: string, owner: string, payload: object) => {
    return Chatbot.findOneAndUpdate(
      { _id: chatbotId, owner },
      { $set: payload },
      { new: true }
    );
  },
};
