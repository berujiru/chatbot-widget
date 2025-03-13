import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { ChatbotWidget } from './components/Chatbot';
function App() {
  useEffect(() => {
    // Initialize the chatbot locally
    ChatbotWidget.init({
      apiKey: "your-openai-api-key",
      apiBaseUrl: "https://prgrp.openai.azure.com/openai/deployments/openaiprocurement/chat/completions?api-version=2023-03-15-preview",
      chatHeadTitle: "AI Assistant",
      chatHeadLogo: "https://robohash.org/BergelChatbot",
      toggleLogo: "https://robohash.org/BergelChatbot",
      botAvatar: "https://robohash.org/Bergel",
    });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Local Chatbot Testing</h1>
      </header>
    </div>
  );
}

export default App;
