import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { RagController } from "./rag.controller";

const router = Router();

const { chat, deleteDocument, getDocumentUrl, updateDocument, uploadDocument } =
  RagController;

router.use(authMiddleware);

router.route("/upload/:chatbotId").post(uploadDocument);
router.route("/fetch/:chatbotId/:documentId").get(getDocumentUrl);
router.route("/:chatbotId").patch(updateDocument).delete(deleteDocument);

export default router;
