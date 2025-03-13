import axios from "axios";
import knowledgeBase from "./knowledgeBase"; // ✅ Import the knowledge base

const API_BASE_URL = "https://api.openai.com/v1/chat/completions";

export const sendMessageToAPI = async (message: string, apiKey: string, apiBaseUrl?: string) => {
  try {
    const response = await axios.post(
      apiBaseUrl ?? API_BASE_URL,
      {
        model: "gpt-4o", // ✅ Use latest GPT model
        messages: [
          {
            role: "system",
            content: knowledgeBase, // ✅ Injects the knowledge base
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7, // Adjust randomness
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("API Error:", error);
    return "Oops! Can you try again?";
  }
};
