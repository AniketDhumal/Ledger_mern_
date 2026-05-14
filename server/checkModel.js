import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModel() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash" // ✅ correct model
    });

    const result = await model.generateContent("Say Hello");
    const text = await result.response.text();

    console.log("✅ Model working!");
    console.log("Response:", text);

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

testModel();