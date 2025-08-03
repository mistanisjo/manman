import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AIChatInput } from "@/components/ui/ai-chat-input";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { useSidebar } from "@/components/ui/sidebar";

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { state: sidebarState } = useSidebar();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Simulate AI thinking time
    timeoutRef.current = setTimeout(() => {
      const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      timeoutRef.current = null;
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
    <div className="flex flex-col h-full w-full relative">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide min-h-0 px-4 md:px-8 py-6 pb-32">
        <div className="max-w-4xl mx-auto w-full space-y-4">
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
      </div>

      {/* Input Area */}
      <motion.div
        className={`fixed bottom-6 z-30 pointer-events-none transition-all duration-200 ease-linear ${
          sidebarState === "expanded" 
            ? "left-80 right-6" 
            : sidebarState === "collapsed" 
            ? "left-16 right-6" 
            : "left-6 right-6"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="pointer-events-auto w-full max-w-4xl mx-auto">
          <AIChatInput onSendMessage={handleSendMessage} />
        </div>
      </motion.div>
    </div>
  );
};

export { ChatInterface };