import { useState } from "react";
import { 
  MessageSquare, 
  User, 
  Moon, 
  Sun, 
  Plus,
  Trash2,
  LogOut,
  ChevronDown,
  Download,
  Upload
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
import { SettingsDialog } from "@/components/settings-dialog";
import { toast } from "@/components/ui/sonner";

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
  onExportChat?: (chatId: string) => void;
  currentChatId?: string;
}

export function AppSidebar({ 
  chatHistory, 
  onSelectChat, 
  onNewChat, 
  onDeleteChat,
  onExportChat,
  currentChatId 
}: AppSidebarProps) {
  const { state } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  
  const collapsed = state === "collapsed";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleExportChat = (chatId: string) => {
    try {
      onExportChat?.(chatId);
      toast.success("Chat exported successfully!");
    } catch (error) {
      toast.error("Failed to export chat");
    }
  };

  const handleImportChat = () => {
    // This would typically open a file picker
    // For now, just show a placeholder message
    toast.info("Import functionality coming soon!");
  };

  return (
    <Sidebar className="transition-all duration-200 ease-linear" collapsible="icon">
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
              className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground transition-colors duration-200"
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
                className="w-10 h-10 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground p-0 rounded-full transition-colors duration-200"
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
            <SidebarMenu className={collapsed ? "space-y-4 mt-4" : "space-y-4"}>
              {chatHistory.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    asChild
                    className={`group relative cursor-pointer transition-all duration-300 ease-out overflow-hidden ${
                      currentChatId === chat.id
                        ? "bg-gradient-to-br from-white/20 via-sidebar-accent/60 to-sidebar-accent backdrop-blur-sm text-sidebar-accent-foreground shadow-2xl shadow-sidebar-accent/30 border border-white/20 scale-[1.02] translate-x-1 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] before:animate-pulse"
                        : "hover:bg-gradient-to-r hover:from-sidebar-accent/20 hover:to-sidebar-accent/30 hover:shadow-md hover:shadow-sidebar-accent/10 hover:border hover:border-sidebar-accent/20 hover:scale-[1.02] hover:-translate-y-0.5"
                    } ${collapsed ? "justify-center p-2 rounded-2xl w-10 h-10 mx-auto" : "py-5 px-4 rounded-xl border border-transparent min-h-[60px]"}`}
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
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out hover:bg-destructive/15 hover:text-destructive hover:scale-110 rounded-lg backdrop-blur-sm"
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
            className={`${collapsed ? "w-10 h-10 p-0 rounded-full" : "w-full justify-start"} text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors duration-200`}
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
                className={`${collapsed ? "w-10 h-10 p-0 rounded-full" : "w-full justify-start p-2 h-auto"} hover:bg-sidebar-accent/60 transition-colors duration-200`}
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
              className="w-56 bg-background/95 backdrop-blur-sm border border-border shadow-2xl rounded-lg"
            >
              <SettingsDialog conversationId={currentChatId || ""} />
              <DropdownMenuItem className="cursor-pointer hover:bg-accent focus:bg-accent transition-colors text-foreground">
                <User className="h-4 w-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-accent focus:bg-accent transition-colors text-foreground"
                onClick={() => currentChatId && handleExportChat(currentChatId)}
              >
                <Download className="h-4 w-4 mr-2" />
                <span>Export Chat</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-accent focus:bg-accent transition-colors text-foreground"
                onClick={handleImportChat}
              >
                <Upload className="h-4 w-4 mr-2" />
                <span>Import Chat</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="cursor-pointer hover:bg-destructive/15 focus:bg-destructive/15 text-destructive transition-colors">
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