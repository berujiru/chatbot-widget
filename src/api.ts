import axios from "axios";

const API_BASE_URL = "https://api.openai.com/v1/chat/completions";

export const sendMessageToAPI = async (message: string, apiKey: string) => {
  try {
    const response = await axios.post(
      API_BASE_URL,
      {
        model: "gpt-4o",
        messages: [{ role: "user", content: message }],
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
    return "Error fetching response.";
  }
};
