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
        chatHeadLogo="https://via.placeholder.com/40?text=CH"
        toggleLogo="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
        botAvatar="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
        logo="https://via.placeholder.com/60?text=L"
      />
      </header>
    </div>
  );
}

export default App;
