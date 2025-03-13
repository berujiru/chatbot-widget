import React, { useState } from "react";
import ReactDOM from "react-dom/client"; // ✅ Supports React 18+
import ChatbotUI from "./ChatbotUI";
import { sendMessageToAPI } from "../api";

interface ChatbotConfig {
  apiKey: string;
  apiBaseUrl?: string;
  chatHeadTitle?: string;
  chatHeadLogo?: string;
  toggleLogo?: string;
  botAvatar?: string;
  logo?: string;
}

interface Message {
  text: string;
  sender: "bot" | "user";
}

const Chatbot: React.FC<ChatbotConfig> = (config) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I assist you today?", sender: "bot" }, // ✅ Default welcome message
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

  const botMessage = await sendMessageToAPI(input, config.apiKey,config.apiBaseUrl);
    setMessages([...newMessages, { text: botMessage, sender: "bot" }]);
  };

  return (
    <ChatbotUI
      {...config}
      messages={messages}
      input={input}
      setInput={setInput}
      sendMessage={sendMessage}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
};

// ✅ Ensure compatibility for both React 17 & 18
const ChatbotWidget = {
  init: (config: ChatbotConfig) => {
    const rootElement = document.createElement("div");
    document.body.appendChild(rootElement);

    if ("createRoot" in ReactDOM) {
      // ✅ Use createRoot() for React 18+
      const root = (ReactDOM as any).createRoot(rootElement);
      root.render(<Chatbot {...config} />);
    } else {
      // ✅ Fallback to React 17 render() method
      (ReactDOM as any).render(<Chatbot {...config} />, rootElement);
    }
  },
};

export { ChatbotWidget };
