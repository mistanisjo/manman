import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";
import { AIChatInput } from "@/components/ui/ai-chat-input";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useOpenAI } from "@/hooks/useOpenAI";
import { toast } from "@/components/ui/sonner";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  currentChatId: string;
  onUpdateChatTitle?: (chatId: string, title: string) => void;
}

const ChatInterface = ({ currentChatId, onUpdateChatTitle }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasGeneratedTitle = useRef(false);
  const { state: sidebarState } = useSidebar();

  // OpenAI integration
  const {
    isLoading,
    error,
    streamMessage,
    clearConversation,
    getConversationSummary
  } = useOpenAI({
    conversationId: currentChatId,
    onError: (error) => {
      toast.error("AI Error", {
        description: error,
      });
    },
    onSuccess: (response) => {
      console.log("AI response received:", response.substring(0, 100) + "...");
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, streamingMessage]);

  // Reset messages when chat changes
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        text: "Hello! I'm your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setStreamingMessage("");
    setIsStreaming(false);
    hasGeneratedTitle.current = false;
  }, [currentChatId]);

  // Generate chat title after first exchange
  const generateChatTitle = async () => {
    if (!hasGeneratedTitle.current && onUpdateChatTitle && messages.length >= 3) {
      try {
        const title = await getConversationSummary();
        onUpdateChatTitle(currentChatId, title);
        hasGeneratedTitle.current = true;
      } catch (error) {
        console.error("Failed to generate chat title:", error);
      }
    }
  };

  const handleAIResponse = async (userMessage: string) => {
    setIsStreaming(true);
    setStreamingMessage("");

    try {
      await streamMessage(userMessage, (chunk: string) => {
        setStreamingMessage(prev => prev + chunk);
      });

      // Add the complete AI response to messages
      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        text: streamingMessage,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setStreamingMessage("");
      
      // Generate chat title after first exchange
      setTimeout(generateChatTitle, 1000);
    } catch (error) {
      console.error("Failed to get AI response:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSendMessage = (text: string) => {
    if (isLoading || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    handleAIResponse(text);
  };

  const handleClearConversation = () => {
    clearConversation();
    setMessages([
      {
        id: "welcome",
        text: "Hello! I'm your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setStreamingMessage("");
    setIsStreaming(false);
    hasGeneratedTitle.current = false;
    toast.success("Conversation cleared");
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <Alert variant="destructive" className="shadow-lg">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearConversation}
                  className="ml-2 h-6 px-2 text-xs"
                >
                  Clear Chat
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

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
          
          {/* Streaming Response */}
          <AnimatePresence>
            {isStreaming && (
              <ChatBubble
                message={streamingMessage}
                isUser={false}
                isTyping={!streamingMessage}
                isStreaming={true}
              />
            )}
          </AnimatePresence>
          
          {/* Loading Indicator */}
          <AnimatePresence>
            {isLoading && !isStreaming && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-center py-4"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </motion.div>
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
          <AIChatInput 
            onSendMessage={handleSendMessage} 
            disabled={isLoading || isStreaming}
            placeholder={isLoading ? "AI is thinking..." : isStreaming ? "AI is responding..." : undefined}
          />
        </div>
      </motion.div>
    </div>
  );
};

export { ChatInterface };