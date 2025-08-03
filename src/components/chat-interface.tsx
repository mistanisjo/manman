import * as React from "react";
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AIChatInput } from "@/components/ui/ai-chat-input";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { useSidebar } from "@/components/ui/sidebar";
import { useChat } from "@/hooks/use-chat";
import { toast } from "@/components/ui/sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ChatInterfaceProps {
  currentChatId: string;
}

const ChatInterface = ({ currentChatId }: ChatInterfaceProps) => {
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    clearError, 
    streamingMessage 
  } = useChat({ 
    sessionId: currentChatId,
    onError: (error) => {
      toast.error("Failed to send message", {
        description: error.message,
      });
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { state: sidebarState } = useSidebar();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handleSendMessage = async (text: string) => {
    try {
      await sendMessage(text);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Error Alert */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Alert variant="destructive" className="shadow-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="ml-2 text-xs underline hover:no-underline"
              >
                Dismiss
              </button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide min-h-0 px-4 md:px-8 py-6 pb-32">
        <div className="max-w-4xl mx-auto w-full space-y-4">
          {/* Welcome message for empty chats */}
          {messages.length === 0 && !streamingMessage && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Welcome to AI Chat
                </h3>
                <p className="text-muted-foreground">
                  Start a conversation by typing a message below. I'm here to help with any questions or tasks you have!
                </p>
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <ChatBubble
                key={`${message.timestamp?.getTime()}-${message.role}`}
                message={message.content}
                isUser={message.role === 'user'}
                timestamp={message.timestamp}
              />
            ))}
          </AnimatePresence>
          
          {/* Streaming Message */}
          <AnimatePresence>
            {streamingMessage && (
              <ChatBubble
                message={streamingMessage}
                isUser={false}
                isStreaming={true}
              />
            )}
          </AnimatePresence>
          
          {/* Loading Indicator */}
          <AnimatePresence>
            {isLoading && !streamingMessage && (
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
          <AIChatInput 
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      </motion.div>
    </div>
  );
};

export { ChatInterface };