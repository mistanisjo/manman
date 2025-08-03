import { useState } from "react";
import { nanoid } from "nanoid";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatInterface } from "@/components/chat-interface";
import { openAIService } from "@/lib/openai";

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const Index = () => {
  const [currentChatId, setCurrentChatId] = useState<string>(() => nanoid());
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: currentChatId,
      title: "New Chat",
      lastMessage: "Hello! I'm your AI assistant...",
      timestamp: new Date(),
    },
  ]);

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleNewChat = () => {
    const newChatId = nanoid();
    const newChat: ChatHistory = {
      id: newChatId,
      title: "New Chat",
      lastMessage: "Start a conversation...",
      timestamp: new Date(),
    };
    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
  };

  const handleDeleteChat = (chatId: string) => {
    // Clear the conversation from OpenAI service
    openAIService.clearConversation(chatId);
    
    const remainingChats = chatHistory.filter(chat => chat.id !== chatId);
    setChatHistory(remainingChats);
    
    if (currentChatId === chatId && remainingChats.length > 0) {
      setCurrentChatId(remainingChats[0].id);
    } else if (remainingChats.length === 0) {
      // Create a new default chat if all chats are deleted
      const newChatId = nanoid();
      const defaultChat = {
        id: newChatId,
        title: "New Chat",
        lastMessage: "Hello! I'm your AI assistant...",
        timestamp: new Date(),
      };
      setChatHistory([defaultChat]);
      setCurrentChatId(newChatId);
    }
  };

  const handleUpdateChatTitle = (chatId: string, title: string) => {
    setChatHistory(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, title, timestamp: new Date() }
          : chat
      )
    );
  };

  const handleExportChat = (chatId: string) => {
    const conversation = openAIService.exportConversation(chatId);
    const chatData = {
      id: chatId,
      title: chatHistory.find(chat => chat.id === chatId)?.title || "Exported Chat",
      messages: conversation,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${chatData.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar
          chatHistory={chatHistory}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onExportChat={handleExportChat}
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
            <ChatInterface 
              currentChatId={currentChatId} 
              onUpdateChatTitle={handleUpdateChatTitle}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
