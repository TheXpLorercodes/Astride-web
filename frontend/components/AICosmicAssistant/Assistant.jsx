'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Assistant.css';

export default function Assistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Greeting, Explorer. I am Gemini-Sec9, your biological-electronic interface. How can I assist your cosmic voyage today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection to deep space network failed. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="assistant-wrapper">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="assistant-window"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <div className="assistant-header">
              <div className="assistant-info">
                <div className="status-dot"></div>
                <span>GEMINI-SEC9</span>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
            </div>

            <div className="assistant-body">
              {messages.map((m, i) => (
                <div key={i} className={`message-bubble ${m.role}`}>
                  {m.content}
                </div>
              ))}
              {isTyping && <div className="message-bubble assistant typing">Thinking...</div>}
              <div ref={chatEndRef} />
            </div>

            <div className="assistant-footer">
              <input 
                type="text" 
                placeholder="Ask about the cosmos..." 
                value={input}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                onChange={(e) => setInput(e.target.value)}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        className={`assistant-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '−' : '✧'}
      </button>
    </div>
  );
}
