import { Request, Response } from "express";
import { ApiError, ApiResponse, asyncHandler } from "../../utils";
import { RagService } from "./rag.service";

export const RagController = {
  uploadDocument: asyncHandler(async (req: Request, res: Response) => {
    const owner = req.user?._id;
    const { chatbotId } = req.params;
    const { filePath } = req.body;

    // give filepath --> "filePath": "pdfs/Resume_Kushal.pdf" --> this will be receieved from frontend supabase response

    if (!filePath) {
      throw new ApiError(400, "filePath is required");
    }

    // checks for duplicate documents and upload the document metadata to DB
    const document = await RagService.uploadDocument(
      owner,
      chatbotId,
      filePath,
    );

    // create embeddings
    await RagService.generateEmbeddings(filePath, chatbotId);

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

  sendMessage: asyncHandler(async (req: Request, res: Response) => {}),

  updateDocument: asyncHandler(async (req: Request, res: Response) => {}),

  deleteDocument: asyncHandler(async (req: Request, res: Response) => {}),

  chat: asyncHandler(async (req: Request, res: Response) => {
    console.log("REQUEST");
    const owner = req.user?._id;
    const { chatbotId } = req.params;
    const { message } = req.body;


    if (!message) {
      throw new ApiError(400, "Message is required");
    }

    const answer = await RagService.chat(owner, chatbotId, message);

    return res
      .status(200)
      .json(new ApiResponse(200, "Chat response generated", { answer }));
  }),
};
