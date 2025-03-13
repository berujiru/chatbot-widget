import React from "react";
import "./Chatbot.css";

interface Message {
  text: string;
  sender: "bot" | "user";
}

interface ChatbotUIProps {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  chatHeadTitle?: string;
  chatHeadLogo?: string;
  toggleLogo?: string;
  botAvatar?: string;
  logo?: string;
}

const ChatbotUI: React.FC<ChatbotUIProps> = ({
  messages,
  input,
  setInput,
  sendMessage,
  isOpen,
  setIsOpen,
  chatHeadTitle = "AI Assistant",
  chatHeadLogo,
  toggleLogo,
  botAvatar,
  logo,
}) => {
  return (
    <div className="chatbot-container">
      <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {toggleLogo ? <img src={toggleLogo} alt="Toggle Chat" className="chat-icon" /> : "💬"}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-head">
            {chatHeadLogo && <img src={chatHeadLogo} alt="Chat Head Logo" className="chat-head-logo" />}
            <span>{chatHeadTitle}</span>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>❌</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.sender}`}>
                {msg.sender === "bot" && botAvatar && <img src={botAvatar} alt="bot-avatar" className="chat-avatar" />}
                <span>{msg.text}</span>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()} // Handle "Enter" key
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotUI;
