import { useState, useCallback, useRef, useEffect } from 'react';
import { openAIService, ChatMessage } from '@/lib/openai';

export interface UseOpenAIOptions {
  conversationId: string;
  onError?: (error: string) => void;
  onSuccess?: (response: string) => void;
}

export interface UseOpenAIReturn {
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<string>;
  streamMessage: (message: string, onChunk: (chunk: string) => void) => Promise<void>;
  conversationHistory: ChatMessage[];
  clearConversation: () => void;
  updateSystemPrompt: (prompt: string) => void;
  exportConversation: () => ChatMessage[];
  importConversation: (messages: ChatMessage[]) => void;
  getConversationSummary: () => Promise<string>;
}

export function useOpenAI({ conversationId, onError, onSuccess }: UseOpenAIOptions): UseOpenAIReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize conversation and load history
  useEffect(() => {
    openAIService.initializeConversation(conversationId);
    setConversationHistory(openAIService.getConversationHistory(conversationId));
  }, [conversationId]);

  // Send message and get response
  const sendMessage = useCallback(async (message: string): Promise<string> => {
    if (!message.trim()) {
      throw new Error('Message cannot be empty');
    }

    setIsLoading(true);
    setError(null);

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await openAIService.generateResponse(conversationId, message);
      
      // Update local conversation history
      setConversationHistory(openAIService.getConversationHistory(conversationId));
      
      onSuccess?.(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [conversationId, onError, onSuccess]);

  // Stream message for real-time response
  const streamMessage = useCallback(async (message: string, onChunk: (chunk: string) => void): Promise<void> => {
    if (!message.trim()) {
      throw new Error('Message cannot be empty');
    }

    setIsLoading(true);
    setError(null);

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const stream = openAIService.streamResponse(conversationId, message);
      
      for await (const chunk of stream) {
        onChunk(chunk);
      }
      
      // Update local conversation history
      setConversationHistory(openAIService.getConversationHistory(conversationId));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [conversationId, onError]);

  // Clear conversation
  const clearConversation = useCallback(() => {
    openAIService.clearConversation(conversationId);
    openAIService.initializeConversation(conversationId);
    setConversationHistory(openAIService.getConversationHistory(conversationId));
    setError(null);
  }, [conversationId]);

  // Update system prompt
  const updateSystemPrompt = useCallback((prompt: string) => {
    openAIService.updateSystemPrompt(conversationId, prompt);
    setConversationHistory(openAIService.getConversationHistory(conversationId));
  }, [conversationId]);

  // Export conversation
  const exportConversation = useCallback(() => {
    return openAIService.exportConversation(conversationId);
  }, [conversationId]);

  // Import conversation
  const importConversation = useCallback((messages: ChatMessage[]) => {
    openAIService.importConversation(conversationId, messages);
    setConversationHistory(openAIService.getConversationHistory(conversationId));
  }, [conversationId]);

  // Get conversation summary
  const getConversationSummary = useCallback(async () => {
    return await openAIService.getConversationSummary(conversationId);
  }, [conversationId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    isLoading,
    error,
    sendMessage,
    streamMessage,
    conversationHistory,
    clearConversation,
    updateSystemPrompt,
    exportConversation,
    importConversation,
    getConversationSummary
  };
}