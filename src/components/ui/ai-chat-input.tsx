"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react";
import { Building2, Plane, Car, MapPin, Paperclip, Send, Mic } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const PLACEHOLDERS = [
  "Ask me anything about the universe...",
  "What's on your mind today?",
  "I'm here to help with any question",
  "Let's explore ideas together",
  "What would you like to know?",
  "Start a conversation with me",
];

interface AIChatInputProps {
  onSendMessage?: (message: string) => void;
  disabled?: boolean;
}

const AIChatInput = ({ onSendMessage, disabled = false }: AIChatInputProps) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [hotelsActive, setHotelsActive] = useState(false);
  const [flightsActive, setFlightsActive] = useState(false);
  const [transfersActive, setTransfersActive] = useState(false);
  const [activitiesActive, setActivitiesActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cycle placeholder text when input is inactive
  useEffect(() => {
    if (isActive || inputValue) return;

    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setShowPlaceholder(true);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, inputValue]);

  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (!inputValue) setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue]);

  const handleActivate = () => setIsActive(true);
  
  const handleSend = () => {
    if (inputValue.trim() && onSendMessage && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue("");
      setIsActive(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSend();
    }
  };

  const containerVariants = {
    collapsed: {
      height: 68,
      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
      transition: { type: "spring" as const, stiffness: 120, damping: 18 },
    },
    expanded: {
      height: 140,
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.16)",
      transition: { type: "spring" as const, stiffness: 120, damping: 18 },
    },
  };

  const placeholderContainerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.025 } },
    exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
  };

  const letterVariants = {
    initial: {
      opacity: 0,
      filter: "blur(12px)",
      y: 10,
    },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        opacity: { duration: 0.25 },
        filter: { duration: 0.4 },
        y: { type: "spring" as const, stiffness: 80, damping: 20 },
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(12px)",
      y: -10,
      transition: {
        opacity: { duration: 0.2 },
        filter: { duration: 0.3 },
        y: { type: "spring" as const, stiffness: 80, damping: 20 },
      },
    },
  };

  return (
    <motion.div
      ref={wrapperRef}
      className="w-full bg-card/95 backdrop-blur-md border border-border/50 rounded-[32px] shadow-xl shadow-black/5 dark:shadow-black/20"
      variants={containerVariants}
      animate={isActive || inputValue ? "expanded" : "collapsed"}
      initial="collapsed"
      style={{ overflow: "hidden" }}
      onClick={handleActivate}
    >
      <div className="flex flex-col items-stretch w-full h-full">
        {/* Input Row */}
        <div className="flex items-center gap-2 p-3 rounded-full w-full">
          <button
            className="p-3 rounded-full hover:bg-accent/50 transition-colors duration-200"
            title="Attach file"
            type="button"
            tabIndex={-1}
          >
            <Paperclip size={20} className="text-muted-foreground hover:text-foreground transition-colors" />
          </button>

          {/* Text Input & Placeholder */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border-0 outline-0 rounded-md py-2 text-base bg-transparent w-full font-normal text-foreground placeholder:text-muted-foreground disabled:opacity-50"
              style={{ position: "relative", zIndex: 1 }}
              onFocus={handleActivate}
              disabled={disabled}
            />
            <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-3 py-2">
              <AnimatePresence mode="wait">
                {showPlaceholder && !isActive && !inputValue && (
                  <motion.span
                    key={placeholderIndex}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground select-none pointer-events-none"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      zIndex: 0,
                    }}
                    variants={placeholderContainerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {PLACEHOLDERS[placeholderIndex]
                      .split("")
                      .map((char, i) => (
                        <motion.span
                          key={i}
                          variants={letterVariants}
                          style={{ display: "inline-block" }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </motion.span>
                      ))}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            className="p-3 rounded-full hover:bg-accent/50 transition-colors duration-200"
            title="Voice input"
            type="button"
            tabIndex={-1}
          >
            <Mic size={20} className="text-muted-foreground hover:text-foreground transition-colors" />
          </button>
          <button
            className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full font-medium justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send"
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || disabled}
          >
            <Send size={18} />
          </button>
        </div>

        {/* Expanded Controls */}
        <motion.div
          className="w-full flex justify-start px-4 items-center text-sm"
          variants={{
            hidden: {
              opacity: 0,
              y: 20,
              pointerEvents: "none" as const,
              transition: { duration: 0.25 },
            },
            visible: {
              opacity: 1,
              y: 0,
              pointerEvents: "auto" as const,
              transition: { duration: 0.35, delay: 0.08 },
            },
          }}
          initial="hidden"
          animate={isActive || inputValue ? "visible" : "hidden"}
          style={{ marginTop: 8 }}
        >
          <div className="flex gap-3 items-center flex-wrap">
            {/* Hotels Toggle */}
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-medium group ${
                hotelsActive
                  ? "bg-primary/15 border border-primary/30 text-primary shadow-sm"
                  : "bg-secondary/80 text-secondary-foreground hover:bg-secondary border border-transparent"
              }`}
              title="Hotels"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHotelsActive((a) => !a);
              }}
            >
              <Building2 size={18} />
              Hotels
            </button>

            {/* Flights Toggle */}
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-medium group ${
                flightsActive
                  ? "bg-primary/15 border border-primary/30 text-primary shadow-sm"
                  : "bg-secondary/80 text-secondary-foreground hover:bg-secondary border border-transparent"
              }`}
              title="Flights"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFlightsActive((a) => !a);
              }}
            >
              <Plane size={18} />
              Flights
            </button>

            {/* Transfers Toggle */}
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-medium group ${
                transfersActive
                  ? "bg-primary/15 border border-primary/30 text-primary shadow-sm"
                  : "bg-secondary/80 text-secondary-foreground hover:bg-secondary border border-transparent"
              }`}
              title="Transfers"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setTransfersActive((a) => !a);
              }}
            >
              <Car size={18} />
              Transfers
            </button>

            {/* Activities Toggle */}
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-medium group ${
                activitiesActive
                  ? "bg-primary/15 border border-primary/30 text-primary shadow-sm"
                  : "bg-secondary/80 text-secondary-foreground hover:bg-secondary border border-transparent"
              }`}
              title="Activities"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActivitiesActive((a) => !a);
              }}
            >
              <MapPin size={18} />
              Activities
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export { AIChatInput };