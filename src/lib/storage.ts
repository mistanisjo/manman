// Local storage utilities for persisting chat data
export interface StoredChat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}

export class ChatStorage {
  private static readonly STORAGE_KEY = 'ai-chat-history';
  private static readonly MAX_STORED_CHATS = 50;

  // Save chat to localStorage
  static saveChat(chat: StoredChat): void {
    try {
      const stored = this.getAllChats();
      const existingIndex = stored.findIndex(c => c.id === chat.id);
      
      if (existingIndex >= 0) {
        stored[existingIndex] = chat;
      } else {
        stored.unshift(chat);
      }

      // Keep only the most recent chats
      const trimmed = stored.slice(0, this.MAX_STORED_CHATS);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to save chat to localStorage:', error);
    }
  }

  // Get all chats from localStorage
  static getAllChats(): StoredChat[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load chats from localStorage:', error);
      return [];
    }
  }

  // Get specific chat by ID
  static getChat(id: string): StoredChat | null {
    try {
      const chats = this.getAllChats();
      return chats.find(chat => chat.id === id) || null;
    } catch (error) {
      console.error('Failed to get chat from localStorage:', error);
      return null;
    }
  }

  // Delete chat from localStorage
  static deleteChat(id: string): void {
    try {
      const chats = this.getAllChats();
      const filtered = chats.filter(chat => chat.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete chat from localStorage:', error);
    }
  }

  // Clear all chats
  static clearAllChats(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear chats from localStorage:', error);
    }
  }

  // Export all chats as JSON
  static exportAllChats(): string {
    const chats = this.getAllChats();
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      version: '1.0',
      chats
    }, null, 2);
  }

  // Import chats from JSON
  static importChats(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.chats || !Array.isArray(data.chats)) {
        throw new Error('Invalid chat data format');
      }

      // Validate chat structure
      const validChats = data.chats.filter((chat: any) => 
        chat.id && 
        chat.title && 
        Array.isArray(chat.messages)
      );

      if (validChats.length === 0) {
        throw new Error('No valid chats found in import data');
      }

      // Merge with existing chats
      const existing = this.getAllChats();
      const merged = [...validChats, ...existing];
      
      // Remove duplicates (prefer imported version)
      const unique = merged.reduce((acc: StoredChat[], chat) => {
        if (!acc.find(c => c.id === chat.id)) {
          acc.push(chat);
        }
        return acc;
      }, []);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(unique.slice(0, this.MAX_STORED_CHATS)));
      return true;
    } catch (error) {
      console.error('Failed to import chats:', error);
      return false;
    }
  }

  // Get storage usage info
  static getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      const used = new Blob([localStorage.getItem(this.STORAGE_KEY) || '']).size;
      const available = 5 * 1024 * 1024; // Assume 5MB localStorage limit
      const percentage = (used / available) * 100;
      
      return { used, available, percentage };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}