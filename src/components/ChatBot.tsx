import { useState } from 'react';
import { Send } from 'lucide-react';

export function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hello! I'm your AI assistant. I can help you with:

• Room bookings and availability
• Meal plans and menus
• Maintenance requests
• Payment information
• General hostel information

How can I assist you today?`
    }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    // TODO: Implement AI response logic
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-[#483285] text-white p-6">
        <h1 className="text-2xl font-bold">AI Assistant</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-[#483285] text-white'
                  : 'bg-white shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.role === 'assistant' && (
                <div className="text-xs text-gray-500 mt-2">
                  {new Date().toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#483285]"
          />
          <button
            type="submit"
            className="bg-[#483285] text-white rounded-lg px-6 py-2 hover:bg-[#5a3fa6] transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}