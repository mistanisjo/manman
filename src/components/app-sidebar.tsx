import { useState } from "react";
import { 
  MessageSquare, 
  Settings, 
  User, 
  Moon, 
  Sun, 
  History,
  Plus,
  Trash2,
  LogOut
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface AppSidebarProps {
  chatHistory: ChatHistory[];
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  currentChatId?: string;
}

export function AppSidebar({ 
  chatHistory, 
  onSelectChat, 
  onNewChat, 
  onDeleteChat,
  currentChatId 
}: AppSidebarProps) {
  const { state } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  
  const collapsed = state === "collapsed";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-80"} collapsible="icon">
      <SidebarContent className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            {!collapsed && (
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-sidebar-foreground">
                  AI Chat
                </h2>
                <p className="text-sm text-sidebar-foreground/60">
                  Your conversations
                </p>
              </div>
            )}
            <SidebarTrigger />
          </div>
          
          {!collapsed && (
            <Button
              onClick={onNewChat}
              className="w-full mt-3 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          )}
        </div>

        {/* Chat History */}
        <SidebarGroup className="flex-1 px-2">
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {!collapsed ? "Recent Chats" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {chatHistory.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    asChild
                    className={`group relative cursor-pointer transition-all duration-200 ${
                      currentChatId === chat.id
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50"
                    }`}
                    onMouseEnter={() => setHoveredChat(chat.id)}
                    onMouseLeave={() => setHoveredChat(null)}
                  >
                    <div
                      onClick={() => onSelectChat(chat.id)}
                      className="flex items-center gap-3 p-2 rounded-md"
                    >
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {chat.title}
                          </p>
                          <p className="text-xs text-sidebar-foreground/60 truncate">
                            {chat.lastMessage}
                          </p>
                        </div>
                      )}
                      {!collapsed && hoveredChat === chat.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(chat.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Management */}
        <div className="mt-auto border-t border-sidebar-border p-4 space-y-2">
          {/* Theme Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 mr-2" />
              ) : (
                <Moon className="h-4 w-4 mr-2" />
              )}
              {!collapsed && (theme === "dark" ? "Light Mode" : "Dark Mode")}
            </Button>
          </div>

          <Separator className="my-2" />

          {/* User Profile */}
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                AI
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground">
                  AI User
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  ai.user@example.com
                </p>
              </div>
            )}
          </div>

          {/* Account Actions */}
          {!collapsed && (
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}