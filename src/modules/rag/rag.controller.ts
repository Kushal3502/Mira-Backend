import { Request, Response } from "express";
import { ApiResponse, asyncHandler } from "../../utils";
import { RagService } from "./rag.service";

export const RagController = {
  uploadDocument: asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const owner = req.user?._id;
    const { chatbotId } = req.params;

    if (!files || files.length === 0) {
      throw new Error("No files uploaded");
    }

    console.log("Uploaded:", files[0].path);

    const document = await RagService.uploadDocument(
      owner,
      chatbotId,
      files[0].path,
    );

    return res
      .status(201)
      .json(new ApiResponse(201, "Document uploaded successfully", document));
  }),

  getAllDocuments: asyncHandler(async (req: Request, res: Response) => {}),

  updateDocument: asyncHandler(async (req: Request, res: Response) => {}),

  deleteDocument: asyncHandler(async (req: Request, res: Response) => {}),

  chat: asyncHandler(async (req: Request, res: Response) => {}),
};
