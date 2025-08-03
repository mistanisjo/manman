import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatInterface } from "@/components/chat-interface";

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const Index = () => {
  const [currentChatId, setCurrentChatId] = useState<string>("welcome");
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: "welcome",
      title: "Welcome Chat",
      lastMessage: "Hello! I'm your AI assistant...",
      timestamp: new Date(),
    },
    {
      id: "2",
      title: "React Discussion",
      lastMessage: "Let's talk about React components...",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "3",
      title: "AI Development",
      lastMessage: "How can I improve my coding skills?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
  ]);

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleNewChat = () => {
    const newChat: ChatHistory = {
      id: Date.now().toString(),
      title: "New Chat",
      lastMessage: "Start a conversation...",
      timestamp: new Date(),
    };
    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const handleDeleteChat = (chatId: string) => {
    const remainingChats = chatHistory.filter(chat => chat.id !== chatId);
    setChatHistory(remainingChats);
    
    if (currentChatId === chatId && remainingChats.length > 0) {
      setCurrentChatId(remainingChats[0].id);
    } else if (remainingChats.length === 0) {
      // Create a new default chat if all chats are deleted
      const defaultChat = {
        id: "welcome",
        title: "Welcome Chat",
        lastMessage: "Hello! I'm your AI assistant...",
        timestamp: new Date(),
      };
      setChatHistory([defaultChat]);
      setCurrentChatId("welcome");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar
          chatHistory={chatHistory}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          currentChatId={currentChatId}
        />
        <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
          {/* Global header with sidebar trigger */}
          <header className="h-14 flex items-center border-b border-sidebar-border bg-sidebar-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-sidebar-background/80 sticky top-0 z-20 px-4 shadow-sm">
            <SidebarTrigger />
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold text-sidebar-foreground">AI Chat Assistant</h1>
            </div>
          </header>
          <div className="flex-1 relative">
            <ChatInterface currentChatId={currentChatId} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
