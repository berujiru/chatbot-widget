import React from 'react';
import logo from './logo.svg';
import './App.css';
import Chatbot from './components/Chatbot';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Chatbot
        apiKey="your-openai-api-key"
        chatHeadTitle="AI Assistant"
        chatHeadLogo="https://robohash.org/BergelChatbot"
        toggleLogo="https://robohash.org/BergelChatbot"
        botAvatar="https://robohash.org/Bergel"
      />
      </header>
    </div>
  );
}

export default App;
