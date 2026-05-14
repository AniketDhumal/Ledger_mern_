import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const userChats = {};

export async function generateChatReply(userId, message) {
  try {
    if (!message || !message.trim()) {
      return "Please type something 🙂";
    }

    const uid = userId || "guest";

    if (!userChats[uid]) {
      userChats[uid] = [];
    }

    // ✅ Add user message
    userChats[uid].push({
      role: "user",
      parts: [{ text: message }],
    });

   const systemPrompt = {
  role: "system",
  parts: [{
    text: `
You are a professional Chartered Accountant (CA) and personal financial advisor.

Behavior Rules:
- Give answers in 4–5 short lines ONLY
- Be clear, practical, and professional
- Focus on financial guidance, savings, and smart decisions
- If user question lacks details, ASK a follow-up question before answering
- Always think like you are managing this person's money

Tone:
- Friendly but professional
- No long paragraphs
- Use bullet points if helpful

Examples:
User: Can I save money?
You:
• Yes, but I need more details  
• What is your monthly income?  
• How much do you spend?  

User: I spend too much on food  
You:
• Food expenses seem high  
• Try limiting outside orders  
• Set a weekly food budget  
• Cook more at home  
`
  }]
};

    const contents = [
      systemPrompt,
      ...userChats[uid],
    ];

    const result = await model.generateContent({ contents });

    const reply = result.response.text();

    // ✅ Save bot reply
    userChats[uid].push({
      role: "model",
      parts: [{ text: reply }],
    });

    // ✅ Limit memory
    userChats[uid] = userChats[uid].slice(-10);

    return reply;

  } catch (err) {
    console.error("CHAT ERROR:", err.message);
    return "Something went wrong ❌";
  }
}