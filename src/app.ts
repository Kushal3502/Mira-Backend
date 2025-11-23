import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import morgan from "morgan";

export const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
});

app.use(
  cors({
    origin: ["https://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(limiter);
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("🚀API is running...");
});

// routes ------------------>
import authRouter from "./modules/auth/auth.routes";
import chatbotRouter from "./modules/chatbot/chatbot.route";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/chatbot", chatbotRouter);
