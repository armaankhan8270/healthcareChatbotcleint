import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Send, User, Bot } from "lucide-react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const predefinedQuestions = [
    "What are my rights under the Affordable Care Act?",
    "Can you explain the HIPAA privacy rules?",
    "How do I file a complaint about healthcare services?",
    "What should I do if my insurance claim is denied?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL, {
        message: input,
      });
      const botMessage = { role: "bot", content: response.data.response };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        role: "bot",
        content: "An error occurred while processing your request.",
      };
      setMessages([...messages, userMessage, errorMessage]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen ">
      <header className="bg-slate-50 text-slate-700 text-center sticky top-0 z-10 p-4 text-xl font-bold shadow-md">
        AI Chat Assistant
      </header>
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 rounded-md shadow-md m-2 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-start space-x-2 max-w-[70%]">
              <div
                className={`rounded-full p-2 ${
                  message.role === "user" ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                {message.role === "user" ? (
                  <User size={20} className="text-white" />
                ) : (
                  <Bot size={20} className="text-gray-600" />
                )}
              </div>
              <div
                className={`rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                } shadow-md`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="sticky bottom-0 bg-white border-t shadow-md p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex flex-wrap gap-2 mb-4">
            {predefinedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(question);
                  handleSendMessage();
                }}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
          <div className="flex ">
            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
