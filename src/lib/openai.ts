import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  systemPrompt: string;
  createdAt: Date;
  updatedAt: Date;
}

// System prompt for the AI assistant
const DEFAULT_SYSTEM_PROMPT = `You are a helpful, knowledgeable, and friendly AI assistant. You should:

1. Provide accurate, helpful, and detailed responses
2. Be conversational and engaging while maintaining professionalism
3. Ask clarifying questions when needed
4. Admit when you don't know something rather than guessing
5. Provide examples and explanations when helpful
6. Be concise but thorough in your responses
7. Remember the context of our conversation
8. Adapt your communication style to match the user's needs

Current date: ${new Date().toLocaleDateString()}`;

export class OpenAIService {
  private static instance: OpenAIService;
  private sessions: Map<string, ChatSession> = new Map();

  private constructor() {
    this.loadSessionsFromStorage();
  }

  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  // Load sessions from localStorage
  private loadSessionsFromStorage() {
    try {
      const stored = localStorage.getItem('chat-sessions');
      if (stored) {
        const sessions = JSON.parse(stored);
        Object.entries(sessions).forEach(([id, session]: [string, any]) => {
          this.sessions.set(id, {
            ...session,
            createdAt: new Date(session.createdAt),
            updatedAt: new Date(session.updatedAt),
            messages: session.messages.map((msg: any) => ({
              ...msg,
              timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined
            }))
          });
        });
      }
    } catch (error) {
      console.error('Failed to load sessions from storage:', error);
    }
  }

  // Save sessions to localStorage
  private saveSessionsToStorage() {
    try {
      const sessionsObj = Object.fromEntries(this.sessions);
      localStorage.setItem('chat-sessions', JSON.stringify(sessionsObj));
    } catch (error) {
      console.error('Failed to save sessions to storage:', error);
    }
  }

  // Create a new chat session
  createSession(title: string = 'New Chat', systemPrompt: string = DEFAULT_SYSTEM_PROMPT): ChatSession {
    const session: ChatSession = {
      id: Date.now().toString(),
      title,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
          timestamp: new Date()
        }
      ],
      systemPrompt,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.sessions.set(session.id, session);
    this.saveSessionsToStorage();
    return session;
  }

  // Get a session by ID
  getSession(id: string): ChatSession | undefined {
    return this.sessions.get(id);
  }

  // Get all sessions
  getAllSessions(): ChatSession[] {
    return Array.from(this.sessions.values()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  // Delete a session
  deleteSession(id: string): boolean {
    const deleted = this.sessions.delete(id);
    if (deleted) {
      this.saveSessionsToStorage();
    }
    return deleted;
  }

  // Add a message to a session
  addMessage(sessionId: string, message: Omit<ChatMessage, 'timestamp'>): ChatMessage {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const newMessage: ChatMessage = {
      ...message,
      timestamp: new Date()
    };

    session.messages.push(newMessage);
    session.updatedAt = new Date();

    // Update title if it's the first user message
    if (message.role === 'user' && session.messages.filter(m => m.role === 'user').length === 1) {
      session.title = this.generateTitle(message.content);
    }

    this.saveSessionsToStorage();
    return newMessage;
  }

  // Generate a title from the first user message
  private generateTitle(content: string): string {
    const words = content.trim().split(' ').slice(0, 6);
    let title = words.join(' ');
    if (content.split(' ').length > 6) {
      title += '...';
    }
    return title || 'New Chat';
  }

  // Get chat completion from OpenAI
  async getChatCompletion(
    sessionId: string,
    onChunk?: (chunk: string) => void,
    onComplete?: (fullResponse: string) => void,
    onError?: (error: Error) => void
  ): Promise<string> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      // Prepare messages for OpenAI (exclude timestamps)
      const messages = session.messages.map(({ role, content }) => ({
        role,
        content
      })) as OpenAI.Chat.Completions.ChatCompletionMessageParam[];

      const stream = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Using the latest efficient model
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      let fullResponse = '';

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          onChunk?.(content);
        }
      }

      // Add the assistant's response to the session
      this.addMessage(sessionId, {
        role: 'assistant',
        content: fullResponse
      });

      onComplete?.(fullResponse);
      return fullResponse;

    } catch (error) {
      console.error('OpenAI API error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      onError?.(new Error(errorMessage));
      throw error;
    }
  }

  // Update session title
  updateSessionTitle(sessionId: string, title: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    session.title = title;
    session.updatedAt = new Date();
    this.saveSessionsToStorage();
    return true;
  }

  // Clear all messages in a session (keep system prompt)
  clearSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    session.messages = session.messages.filter(m => m.role === 'system');
    session.updatedAt = new Date();
    this.saveSessionsToStorage();
    return true;
  }
}

export const openAIService = OpenAIService.getInstance();