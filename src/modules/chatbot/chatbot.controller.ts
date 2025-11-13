import { Request, Response } from "express";
import { ApiError, ApiResponse, asyncHandler } from "../../utils";
import { createChatbot, findChatbotByName } from "./chatbot.service";

export const addChatbot = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const { name, description, logo } = req.body;

  if (!name) throw new ApiError(400, "Please provide a name");

  const existingBot = await findChatbotByName(name, userId);

  if (existingBot)
    throw new ApiError(
      400,
      "Chatbot already exists with this name. Please choose a unique one.",
    );

  const newChatbot = await createChatbot({
    user: userId,
    name,
    description,
    logo,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Chatbot created successfully", newChatbot));
});

export const fetchAllChatBots = asyncHandler(
  async (req: Request, res: Response) => {},
);

export const fetchChatbotById = asyncHandler(
  async (req: Request, res: Response) => {},
);

export const updateChatbot = asyncHandler(
  async (req: Request, res: Response) => {},
);

export const deleteChatbot = asyncHandler(
  async (req: Request, res: Response) => {},
);
