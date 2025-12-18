import { Request, Response } from "express";
import { ApiError, ApiResponse, asyncHandler } from "../../utils";
import { RagService } from "./rag.service";

export const RagController = {
  uploadDocument: asyncHandler(async (req: Request, res: Response) => {
    const owner = req.user?._id;
    const { chatbotId } = req.params;
    const { filePath } = req.body;

    if (!filePath) {
      throw new ApiError(400, "filePath is required");
    }
    ``;

    await RagService.generateEmbeddings(filePath);

    const document = await RagService.uploadDocument(
      owner,
      chatbotId,
      filePath,
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Embeddings created.", document));
  }),

  getDocumentUrl: asyncHandler(async (req: Request, res: Response) => {
    const owner = req.user?._id;
    const { chatbotId, documentId } = req.params;

    const url = await RagService.getDocumentUrl(owner, chatbotId, documentId);

    return res
      .status(200)
      .json(new ApiResponse(200, "Signed URL generated", { url }));
  }),

  updateDocument: asyncHandler(async (req: Request, res: Response) => {}),

  deleteDocument: asyncHandler(async (req: Request, res: Response) => {}),

  chat: asyncHandler(async (req: Request, res: Response) => {}),
};
