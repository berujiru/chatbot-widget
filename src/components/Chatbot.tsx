import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faRedo } from "@fortawesome/free-solid-svg-icons";
import "./Chatbot.css";

interface ChatbotProps {
  apiKey: string;
  chatHeadTitle?: string;
  chatHeadLogo?: string;
  toggleLogo?: string;
  botAvatar?: string;
  logo?: string;
  maxConversationHours?: number;
}

interface Message {
  text: string;
  sender: "bot" | "user";
  timestamp: number;
}

const Chatbot: React.FC<ChatbotProps> = ({
  apiKey,
  chatHeadTitle = "Chat Assistant",
  chatHeadLogo,
  toggleLogo,
  botAvatar = "https://via.placeholder.com/40",
  logo = "https://via.placeholder.com/60",
  maxConversationHours = 24,
}) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const now = Date.now();
    const defaultMessage: Message = {
      text: "Hello! How can I assist you today?",
      sender: "bot",
      timestamp: now,
    };
  
    try {
      const savedMessages = localStorage.getItem("chatHistory");
      if (savedMessages) {
        const parsedMessages: Message[] = JSON.parse(savedMessages);
        const expirationTime = maxConversationHours * 60 * 60 * 1000;
  
        // Filter only valid messages within the expiration time
        const validMessages = parsedMessages.filter((msg) => now - msg.timestamp < expirationTime);
  
        return validMessages.length > 0 ? validMessages : [defaultMessage];
      }
    } catch (error) {
      console.error("Error parsing chat history:", error);
    }
  
    return [defaultMessage];
  });

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // AI Thinking State

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const resetChat = () => {
    setMessages([{ text: "Hello! How can I assist you today?", sender: "bot", timestamp: Date.now() }]);
    localStorage.removeItem("chatHistory");
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { text: input, sender: "user", timestamp: Date.now() }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true); // Show "Thinking..." indicator

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

      setTimeout(() => {
        setMessages([...newMessages, { text: botMessage, sender: "bot", timestamp: Date.now() }]);
        setIsTyping(false); // Remove "Thinking..." after response
      }, 1000); // Simulate delay
    } catch (error) {
      setMessages([...newMessages, { text: "Error fetching response.", sender: "bot", timestamp: Date.now() }]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          {toggleLogo ? <img src={toggleLogo} alt="Toggle Chat" /> : "💬"}
        </button>
      )}

      {isOpen && (
        <motion.div
          className="chat-window"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="chat-head">
            {chatHeadLogo && <img src={chatHeadLogo} alt="Chat Head Logo" className="chat-head-logo" />}
            <span>{chatHeadTitle}</span>
            <button className="chat-reset-btn" onClick={resetChat}>
              <FontAwesomeIcon icon={faRedo} />
            </button>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                className={`chat-bubble ${msg.sender}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {msg.sender === "bot" && <img src={botAvatar} alt="bot-avatar" className="chat-avatar" />}
                <span>{msg.text}</span>
              </motion.div>
            ))}

            {/* Show AI Thinking Indicator */}
            {isTyping && (
              <motion.div
                className="chat-bubble bot typing-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <span>Thinking...</span>
              </motion.div>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Chatbot;
