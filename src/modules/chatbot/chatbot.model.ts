import mongoose from "mongoose";

const chatbotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: String,
    description: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    systemInstruction: {
      type: String,
      default: "You are a helpful assistant.",
    },
    documents: [
      {
        fileName: String,
        url: String,
        size: Number,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Chatbot = mongoose.model("Chatbot", chatbotSchema);
