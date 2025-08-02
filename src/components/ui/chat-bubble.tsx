import * as React from "react";
import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
  isTyping?: boolean;
}

const TypingIndicator = () => (
  <div className="flex space-x-1 p-2">
    <motion.div
      className="w-2 h-2 bg-current rounded-full opacity-60"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
    />
    <motion.div
      className="w-2 h-2 bg-current rounded-full opacity-60"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
    />
    <motion.div
      className="w-2 h-2 bg-current rounded-full opacity-60"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
    />
  </div>
);

const ChatBubble = ({ message, isUser, timestamp, isTyping }: ChatBubbleProps) => {
  return (
    <motion.div
      className={cn(
        "flex items-start gap-3 mb-6 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Avatar */}
      <motion.div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          isUser 
            ? "user-bubble" 
            : "ai-bubble"
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
      >
        {isUser ? (
          <User size={18} className="text-user-foreground" />
        ) : (
          <Bot size={18} className="text-ai-foreground" />
        )}
      </motion.div>

      {/* Message Content */}
      <motion.div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3 relative",
          isUser
            ? "user-bubble rounded-tr-sm"
            : "ai-bubble rounded-tl-sm"
        )}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
      >
        {isTyping ? (
          <TypingIndicator />
        ) : (
          <p className={cn(
            "text-sm leading-relaxed whitespace-pre-wrap",
            isUser ? "text-user-foreground" : "text-ai-foreground"
          )}>
            {message}
          </p>
        )}
        
        {timestamp && !isTyping && (
          <motion.span
            className={cn(
              "text-xs opacity-60 mt-1 block",
              isUser ? "text-user-foreground" : "text-ai-foreground"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
          >
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
};

export { ChatBubble };