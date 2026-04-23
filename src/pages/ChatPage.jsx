import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import { chatAPI } from '../api';
import useUserStore from '../store/userStore';

const SUGGESTIONS = [
  'How do I submit a topic?',
  'How do I create a group?',
  'How do reports work?',
  'What is the project diary?',
  'How does mentor feedback work?',
];

const DEFAULT_MESSAGE = {
  role: 'assistant',
  text: "Hi! I'm your ProjectPilot assistant 👋 I can help you with anything about the platform — submitting topics, reports, diary entries, groups, and more. What would you like to know?",
};

function FormattedMessage({ text }) {
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    // Heading ##
    if (line.startsWith('## ')) {
      elements.push(<p key={i} className="font-bold text-gray-900 mt-2">{line.replace(/^## /, '')}</p>);
    }
    // Bold line **text**
    else if (/^\*\*(.+)\*\*:?$/.test(line.trim())) {
      elements.push(<p key={i} className="font-semibold text-gray-800 mt-2">{line.replace(/\*\*/g, '').trim()}</p>);
    }
    // Numbered list
    else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <div key={i} className="flex gap-2 ml-2">
          <span className="text-blue-500 font-medium shrink-0">{line.match(/^\d+/)[0]}.</span>
          <span>{formatInline(line.replace(/^\d+\.\s/, ''))}</span>
        </div>
      );
    }
    // Bullet list
    else if (/^[-*]\s/.test(line)) {
      elements.push(
        <div key={i} className="flex gap-2 ml-2">
          <span className="text-blue-500 shrink-0">•</span>
          <span>{formatInline(line.replace(/^[-*]\s/, ''))}</span>
        </div>
      );
    }
    else {
      elements.push(<p key={i} className="text-gray-800">{formatInline(line)}</p>);
    }
    i++;
  }
  return <div className="space-y-1">{elements}</div>;
}

function formatInline(text) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : p);
}

export default function ChatPage({ Sidebar, Topbar }) {
  const { user } = useUserStore();
  const storageKey = `chat_history_${user?.id || user?._id}`;

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [DEFAULT_MESSAGE];
    } catch {
      return [DEFAULT_MESSAGE];
    }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || isLoading) return;

    const userMsg = { role: 'user', text: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const history = updatedMessages
        .slice(1)
        .slice(0, -1)
        .map((m) => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }));

      const res = await chatAPI.sendMessage(userText, history);
      setMessages((prev) => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch (err) {
      const msg = err.response?.data?.error || 'Sorry, something went wrong. Please try again.';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: msg },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 py-6 overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">ProjectPilot Assistant</h1>
              <p className="text-xs text-green-500 font-medium">● Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-200'}`}>
                  {msg.role === 'user'
                    ? <User className="w-4 h-4 text-white" />
                    : <Bot className="w-4 h-4 text-gray-600" />
                  }
                </div>
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm'
                }`}>
                  {msg.role === 'assistant' ? <FormattedMessage text={msg.text} /> : msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-sm text-gray-400">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions - only show at start */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 my-4">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={`suggestion-${i}`}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-blue-400 hover:text-blue-600 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="mt-4 flex items-end gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about ProjectPilot..."
              rows={1}
              className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder-gray-400 max-h-32"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl flex items-center justify-center transition shrink-0"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
