import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import {
  addChatbot,
  deleteChatbot,
  fetchAllChatBots,
  fetchChatbotById,
  updateChatbot,
} from "./chatbot.controller";

const router = Router();

router.use(authMiddleware);

router.route("/add").post(addChatbot);
router.route("/fetch-all").get(fetchAllChatBots);
router
  .route("/:chatbotId")
  .get(fetchChatbotById)
  .patch(updateChatbot)
  .delete(deleteChatbot);

export default router;
