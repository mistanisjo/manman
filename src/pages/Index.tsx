import { useState } from "react";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatInterface } from "@/components/chat-interface";
import { openAIService, ChatSession } from "@/lib/openai";
import { toast } from "@/components/ui/sonner";

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const Index = () => {
  const [currentChatId, setCurrentChatId] = useState<string>("welcome");
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

  // Load chat sessions on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = () => {
    const sessions = openAIService.getAllSessions();
    const history: ChatHistory[] = sessions.map(session => {
      const lastUserMessage = session.messages
        .filter(m => m.role === 'user')
        .pop();
      const lastAssistantMessage = session.messages
        .filter(m => m.role === 'assistant')
        .pop();
      
      const lastMessage = lastAssistantMessage?.content || 
                         lastUserMessage?.content || 
                         "Start a conversation...";

      return {
        id: session.id,
        title: session.title,
        lastMessage: lastMessage.length > 50 
          ? lastMessage.substring(0, 50) + "..." 
          : lastMessage,
        timestamp: session.updatedAt
      };
    });

    setChatHistory(history);

    // If no sessions exist, create a welcome session
    if (sessions.length === 0) {
      const welcomeSession = openAIService.createSession("Welcome Chat");
      setCurrentChatId(welcomeSession.id);
      loadChatHistory(); // Reload to include the new session
    } else if (!sessions.find(s => s.id === currentChatId)) {
      // If current chat doesn't exist, switch to the first available
      setCurrentChatId(sessions[0].id);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleNewChat = () => {
    try {
      const newSession = openAIService.createSession("New Chat");
      setCurrentChatId(newSession.id);
      loadChatHistory(); // Reload to include the new session
      toast.success("New chat created");
    } catch (error) {
      console.error('Failed to create new chat:', error);
      toast.error("Failed to create new chat");
    }
  };

  const handleDeleteChat = (chatId: string) => {
    try {
      const deleted = openAIService.deleteSession(chatId);
      if (deleted) {
        loadChatHistory();
        
        // If we deleted the current chat, switch to another one
        if (currentChatId === chatId) {
          const remainingSessions = openAIService.getAllSessions();
          if (remainingSessions.length > 0) {
            setCurrentChatId(remainingSessions[0].id);
          } else {
            // Create a new chat if no chats remain
            const newSession = openAIService.createSession("Welcome Chat");
            setCurrentChatId(newSession.id);
            loadChatHistory();
          }
        }
        
        toast.success("Chat deleted");
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      toast.error("Failed to delete chat");
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
