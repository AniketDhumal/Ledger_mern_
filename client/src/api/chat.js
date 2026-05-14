import api from "./client";

export const sendMessage = async (message, userId = "user123") => {
  try {
    const res = await api.post("/chat", {
      message,
      userId,
    });

    return res.data.reply;

  } catch (err) {
    console.error("API ERROR:", err);
    throw err;
  }
};