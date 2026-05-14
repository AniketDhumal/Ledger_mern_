import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// 🔥 memory
const userChats = {};

router.post("/", async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!userChats[userId]) {
      userChats[userId] = [];
    }

    userChats[userId].push({
      role: "user",
      parts: [{ text: message }],
    });

    const result = await model.generateContent({
      contents: userChats[userId],
    });

    const reply = result.response.text();

    userChats[userId].push({
      role: "model",
      parts: [{ text: reply }],
    });

    userChats[userId] = userChats[userId].slice(-10);

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
});

export default router;