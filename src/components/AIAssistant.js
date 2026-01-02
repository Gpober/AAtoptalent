'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Sparkles, User, Loader2, Search, Users, Briefcase, Building2 } from 'lucide-react';

const suggestedPrompts = [
  { icon: Users, text: "Find candidates with React experience", category: "candidates" },
  { icon: Briefcase, text: "Search for remote software engineer jobs", category: "jobs" },
  { icon: Building2, text: "Which companies are hiring in tech?", category: "market" },
  { icon: Sparkles, text: "Analyze my candidate pipeline", category: "insights" },
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI recruiting assistant. I can help you:\n\n• **Find candidates** in your database by skills, experience, or location\n• **Search for jobs** across the web to match with your candidates\n• **Analyze fit** between candidates and job requirements\n• **Get market insights** on hiring trends\n\nHow can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async (text = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-10) // Send last 10 messages for context
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${data.error}. Please try again.`,
          isError: true
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          data: data.data // Any structured data (candidates, jobs, etc.)
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Please check your connection and try again.',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (message) => {
    // Simple markdown-like rendering
    const content = message.content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');

    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        {message.data?.candidates && message.data.candidates.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.data.candidates.map((candidate, idx) => (
              <a
                key={idx}
                href={`/dashboard/candidates/${candidate.id}`}
                className="block p-2 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
              >
                <div className="font-medium text-sm">{candidate.firstName} {candidate.lastName}</div>
                <div className="text-xs text-gray-600">{candidate.title} • {candidate.location}</div>
              </a>
            ))}
          </div>
        )}
        {message.data?.jobs && message.data.jobs.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.data.jobs.map((job, idx) => (
              <div key={idx} className="p-2 bg-white/50 rounded-lg">
                <div className="font-medium text-sm">{job.title}</div>
                <div className="text-xs text-gray-600">{job.company} • {job.location}</div>
                {job.url && (
                  <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                    View Job →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white hover:scale-105 z-50"
      >
        <Bot className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-72' : 'w-96'}`}>
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col ${isMinimized ? 'h-14' : 'h-[600px]'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 flex items-center justify-between cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">AI Recruiting Assistant</div>
              {!isMinimized && <div className="text-xs text-white/80">Powered by Claude</div>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-blue-900 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    message.role === 'user'
                      ? 'bg-blue-900 text-white rounded-br-md'
                      : message.isError
                        ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-md'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                  }`}>
                    {renderMessageContent(message)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-2">Try asking:</div>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt.text)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      <prompt.icon className="w-3 h-3" />
                      {prompt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about candidates, jobs, or market insights..."
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
