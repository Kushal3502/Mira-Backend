import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

export const app = express();

app.use(
  cors({
    origin: ["https://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("🚀API is running...");
});

// routes ------------------>
import authRouter from "./modules/auth/auth.routes";

app.use("/api/v1/auth", authRouter);
