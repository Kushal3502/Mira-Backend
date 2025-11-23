import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { ChatbotController } from "./chatbot.controller";

const router = Router();

const { addChatbot, fetchChatbots, getChatbot, deleteChatbot, updateChatbot } =
  ChatbotController;

router.use(authMiddleware);

router.route("/add").post(addChatbot);
router.route("/fetch-all").get(fetchChatbots);
router
  .route("/:chatbotId")
  .get(getChatbot)
  .patch(updateChatbot)
  .delete(deleteChatbot);

export default router;
