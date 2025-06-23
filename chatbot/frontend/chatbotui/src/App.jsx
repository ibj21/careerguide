import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // We'll define styles here

const App = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatActive, setIsChatActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (!conversationId) {
      setConversationId(Date.now().toString());
    }
  }, [conversationId]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === '') return;

    setLoading(true);
    setChatHistory((prev) => [...prev, { sender: 'user', text: message }]);

    try {
      const response = await fetch(`http://localhost:8000/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversation_id: conversationId }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      setChatHistory((prev) => [...prev, { sender: 'ai', text: data.response }]);
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-box">
        <div className="chat-header">
          <h1>AI Chatbot</h1>
        </div>

        <div className="chat-history" ref={chatContainerRef}>
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`message-row ${msg.sender === 'user' ? 'user' : 'ai'}`}
            >
              <div className="message-bubble">{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div className="message-row ai">
              <div className="message-bubble loading">AI is typing...</div>
            </div>
          )}
        </div>

        {isChatActive && (
          <form className="chat-form" onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit" disabled={loading || !message.trim()}>
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default App;
