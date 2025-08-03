import { useState, useCallback, useEffect } from 'react';
import { openAIService, ChatMessage, ChatSession } from '@/lib/openai';

export interface UseChatOptions {
  sessionId?: string;
  onError?: (error: Error) => void;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
  session: ChatSession | null;
  streamingMessage: string;
}

export function useChat({ sessionId, onError }: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [streamingMessage, setStreamingMessage] = useState('');

  // Load session when sessionId changes
  useEffect(() => {
    if (sessionId) {
      const loadedSession = openAIService.getSession(sessionId);
      if (loadedSession) {
        setSession(loadedSession);
        // Filter out system messages for display
        setMessages(loadedSession.messages.filter(m => m.role !== 'system'));
      }
    } else {
      setSession(null);
      setMessages([]);
    }
  }, [sessionId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!sessionId || !session) {
      setError('No active session');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStreamingMessage('');

    try {
      // Add user message
      const userMessage = openAIService.addMessage(sessionId, {
        role: 'user',
        content
      });

      // Update local state immediately
      setMessages(prev => [...prev, userMessage]);

      // Get AI response with streaming
      await openAIService.getChatCompletion(
        sessionId,
        // On chunk received
        (chunk: string) => {
          setStreamingMessage(prev => prev + chunk);
        },
        // On completion
        (fullResponse: string) => {
          setStreamingMessage('');
          // Reload session to get the assistant's message
          const updatedSession = openAIService.getSession(sessionId);
          if (updatedSession) {
            setSession(updatedSession);
            setMessages(updatedSession.messages.filter(m => m.role !== 'system'));
          }
        },
        // On error
        (error: Error) => {
          setError(error.message);
          onError?.(error);
          setStreamingMessage('');
        }
      );

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      setStreamingMessage('');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, session, onError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearError,
    session,
    streamingMessage
  };
}