import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./Chatbot.css";

interface ChatbotProps {
  apiKey: string;
  chatHeadTitle?: string;
  botAvatar?: string;
  userAvatar?: string;
  logo?: string;
}

interface Message {
  text: string;
  sender: "bot" | "user";
}

const Chatbot: React.FC<ChatbotProps> = ({
  apiKey,
  chatHeadTitle = "Chat Assistant",
  botAvatar = "https://via.placeholder.com/40",
  userAvatar = "https://via.placeholder.com/40",
  logo = "https://via.placeholder.com/60",
}) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    return savedMessages ? JSON.parse(savedMessages) : [{ text: "Hello! How can I assist you today?", sender: "bot" }];
  });

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [{ role: "user", content: input }],
        },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );

      const botMessage = response.data.choices[0].message.content;
      setMessages([...newMessages, { text: botMessage, sender: "bot" }]);
    } catch (error) {
      setMessages([...newMessages, { text: "Error fetching response.", sender: "bot" }]);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat Head */}
      <div className="chat-head" onClick={() => setIsOpen(!isOpen)}>
        <img src={logo} alt="Chatbot Logo" className="chat-logo" />
        <span>{chatHeadTitle}</span>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <motion.div className="chat-window" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <motion.div key={index} className={`chat-bubble ${msg.sender}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                <img src={msg.sender === "bot" ? botAvatar : userAvatar} alt="avatar" className="chat-avatar" />
                <span>{msg.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Input Field */}
          <div className="chat-input">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
            <button onClick={sendMessage}>Send</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Chatbot;
