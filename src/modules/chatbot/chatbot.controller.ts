import { Request, Response } from "express";
import { ApiResponse, asyncHandler } from "../../utils";
import { ChatbotService } from "./chatbot.service";

export const ChatbotController = {
  addChatbot: asyncHandler(async (req: Request, res: Response) => {
    const owner = req.user?._id;

    const chatbot = await ChatbotService.addChatbot(owner, req.body);

    res
      .status(201)
      .json(new ApiResponse(201, "Chatbot created successfully.", chatbot));
  }),

  fetchChatbots: asyncHandler(async (req: Request, res: Response) => {
    const owner = req.user?._id;

    const chatbots = await ChatbotService.fetchChatbots(owner);

    res
      .status(201)
      .json(new ApiResponse(200, "Chatbots fetched successfully.", chatbots));
  }),

  getChatbot: asyncHandler(async (req: Request, res: Response) => {
    const owner = req.user?._id;

    const chatbot = await ChatbotService.getChatbot(
      owner,
      req.params.chatbotId,
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Chatbot fetched successfully.", chatbot));
  }),

  deleteChatbot: asyncHandler(async (req: Request, res: Response) => {
    const owner = req.user?._id;

    await ChatbotService.deleteChatbot(owner, req.params.chatbotId);

    res.status(200).json(new ApiResponse(200, "Chatbot deleted successfully."));
  }),

  updateChatbot: asyncHandler(async (req: Request, res: Response) => {
    const owner = req.user?._id;
    const { chatbotId } = req.params;

    const updated = await ChatbotService.updateChatbot(
      owner,
      chatbotId,
      req.body,
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Chatbot updated successfully.", updated));
  }),
};
