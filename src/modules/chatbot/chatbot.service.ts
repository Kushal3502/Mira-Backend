import { Chatbot } from "./chatbot.model";

export const findChatbotByName = async (
  name: string,
  owner: string | undefined,
) => {
  return await Chatbot.findOne({
    name,
    owner,
  });
};

export const createChatbot = async (payload: object) => {
  return await Chatbot.create(payload);
};
