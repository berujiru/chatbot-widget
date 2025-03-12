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
        botAvatar="https://via.placeholder.com/40?text=B"
        userAvatar="https://via.placeholder.com/40?text=U"
        logo="https://via.placeholder.com/60?text=L"
      />
      </header>
    </div>
  );
}

export default App;
