import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { upload } from "../../middlewares/multer.middleware";
import { RagController } from "./rag.controller";

const router = Router();

const {
  chat,
  deleteDocument,
  getAllDocuments,
  updateDocument,
  uploadDocument,
} = RagController;

router.use(authMiddleware);

router
  .route("/upload/:chatbotId")
  .post(upload.array("documents"), uploadDocument);
router.route("/fetch-all").get(getAllDocuments);
router.route("/:chatbotId").patch(updateDocument).delete(deleteDocument);

export default router;
