import { useState } from "react";
import { 
  MessageSquare, 
  Settings, 
  User, 
  Moon, 
  Sun, 
  Plus,
  Trash2,
  LogOut,
  ChevronDown
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <div className={`p-4 border-b border-sidebar-border ${collapsed ? "flex flex-col items-center" : ""}`}>
          {!collapsed && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-sidebar-foreground">
                AI Chat
              </h2>
              <p className="text-sm text-sidebar-foreground/60">
                Your conversations
              </p>
            </div>
          )}
          
          {!collapsed && (
            <Button
              onClick={onNewChat}
              className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          )}
          
          {collapsed && (
            <div className="flex flex-col items-center space-y-2">
              <Button
                onClick={onNewChat}
                className="w-10 h-10 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground p-0 rounded-full"
                size="sm"
                title="New Chat"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Chat History */}
        <SidebarGroup className="flex-1 px-2">
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {!collapsed ? "Recent Chats" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className={collapsed ? "space-y-3 mt-4" : "space-y-2"}>
              {chatHistory.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    asChild
                    className={`group relative cursor-pointer transition-all duration-200 ${
                      currentChatId === chat.id
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50"
                    } ${collapsed ? "justify-center p-2 rounded-full w-10 h-10 mx-auto" : "p-3 rounded-lg"}`}
                    onMouseEnter={() => setHoveredChat(chat.id)}
                    onMouseLeave={() => setHoveredChat(null)}
                  >
                    <div
                      onClick={() => onSelectChat(chat.id)}
                      className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
                      title={collapsed ? chat.title : ""}
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
        <div className={`mt-auto border-t border-sidebar-border p-4 space-y-3 ${collapsed ? "flex flex-col items-center" : ""}`}>
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className={`${collapsed ? "w-10 h-10 p-0 rounded-full" : "w-full justify-start"} text-sidebar-foreground hover:bg-sidebar-accent`}
            title={collapsed ? (theme === "dark" ? "Light Mode" : "Dark Mode") : ""}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {!collapsed && <span className="ml-2">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </Button>

          {!collapsed && <Separator />}

          {/* User Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`${collapsed ? "w-10 h-10 p-0 rounded-full" : "w-full justify-start p-2 h-auto"} hover:bg-sidebar-accent`}
              >
                <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : "w-full"}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-sidebar-foreground">
                          AI User
                        </p>
                        <p className="text-xs text-sidebar-foreground/60">
                          ai.user@example.com
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
                    </>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-sidebar-background border-sidebar-border"
            >
              <DropdownMenuItem className="cursor-pointer hover:bg-sidebar-accent focus:bg-sidebar-accent">
                <User className="h-4 w-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-sidebar-accent focus:bg-sidebar-accent">
                <Settings className="h-4 w-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-sidebar-border" />
              <DropdownMenuItem className="cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}