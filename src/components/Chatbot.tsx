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
  /**
   * An array of messages exchanged between the user and the bot.
   * Each message contains the text of the message and the sender.
   */
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    return savedMessages ? JSON.parse(savedMessages) : [{ text: "Hello! How can I assist you today?", sender: "bot" }];
  });

  /**
   * The input text entered by the user.
   */
  const [input, setInput] = useState("");

  /**
   * Whether the chat window is open or not.
   */
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Save the chat history to local storage.
   */
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  /**
   * Send the user's message to the bot and display the response.
   */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      /**
       * Make a POST request to the OpenAI API to get the response from the bot.
       */
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
      /**
       * If there is an error fetching the response, display a generic error message.
       */
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
        <motion.div
          className="chat-window"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                className={`chat-bubble ${msg.sender}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
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
