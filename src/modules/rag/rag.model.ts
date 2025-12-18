import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chatbot",
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Documents = mongoose.model("Document", documentSchema);
