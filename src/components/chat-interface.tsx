import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AIChatInput } from "@/components/ui/ai-chat-input";
import { ChatBubble } from "@/components/ui/chat-bubble";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AI_RESPONSES = [
  "That's a fascinating question! Let me think about that for a moment...",
  "I'd be happy to help you with that. Here's what I think...",
  "Great point! From my perspective, I would say...",
  "That's an interesting way to look at it. Here's my take...",
  "I appreciate you asking that. Let me share my thoughts...",
  "Excellent question! I think the key here is...",
];

interface ChatInterfaceProps {
  currentChatId: string;
}

const ChatInterface = ({ currentChatId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const handleSendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    simulateAIResponse(text);
  };

  return (
    <div className="flex flex-col h-full w-full px-6 py-6 pb-24">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide min-h-0 max-w-4xl mx-auto w-full">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <ChatBubble
              message=""
              isUser={false}
              isTyping={true}
            />
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        className="fixed bottom-6 left-0 right-0 flex justify-center z-20 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="pointer-events-auto">
          <AIChatInput onSendMessage={handleSendMessage} />
        </div>
      </motion.div>
    </div>
  );
};

export { ChatInterface };