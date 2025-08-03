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

export interface OpenAIConfig {
  model: string;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
}

export const defaultConfig: OpenAIConfig = {
  model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
  maxTokens: parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS || '2000'),
  temperature: parseFloat(import.meta.env.VITE_OPENAI_TEMPERATURE || '0.7'),
  systemPrompt: `You are a helpful, knowledgeable, and friendly AI assistant. You provide accurate, thoughtful, and engaging responses while maintaining a conversational tone.

Key guidelines:
- Be helpful and informative
- Provide clear, well-structured responses
- Ask clarifying questions when needed
- Admit when you don't know something
- Be concise but thorough
- Maintain context from previous messages in the conversation
- Use markdown formatting when appropriate for better readability

Current date: ${new Date().toLocaleDateString()}
Current time: ${new Date().toLocaleTimeString()}`
};

export class OpenAIService {
  private config: OpenAIConfig;
  private conversationHistory: Map<string, ChatMessage[]> = new Map();

  constructor(config: OpenAIConfig = defaultConfig) {
    this.config = config;
  }

  // Initialize conversation with system prompt
  initializeConversation(conversationId: string): void {
    if (!this.conversationHistory.has(conversationId)) {
      this.conversationHistory.set(conversationId, [
        {
          role: 'system',
          content: this.config.systemPrompt,
          timestamp: new Date()
        }
      ]);
    }
  }

  // Add message to conversation history
  addMessage(conversationId: string, message: ChatMessage): void {
    this.initializeConversation(conversationId);
    const history = this.conversationHistory.get(conversationId)!;
    history.push({
      ...message,
      timestamp: new Date()
    });

    // Keep only last 20 messages (plus system prompt) to manage token usage
    if (history.length > 21) {
      const systemMessage = history[0];
      const recentMessages = history.slice(-20);
      this.conversationHistory.set(conversationId, [systemMessage, ...recentMessages]);
    }
  }

  // Get conversation history
  getConversationHistory(conversationId: string): ChatMessage[] {
    return this.conversationHistory.get(conversationId) || [];
  }

  // Clear conversation history
  clearConversation(conversationId: string): void {
    this.conversationHistory.delete(conversationId);
  }

  // Get all conversation IDs
  getConversationIds(): string[] {
    return Array.from(this.conversationHistory.keys());
  }

  // Generate AI response
  async generateResponse(conversationId: string, userMessage: string): Promise<string> {
    try {
      // Validate API key
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
      }

      // Initialize conversation if needed
      this.initializeConversation(conversationId);

      // Add user message to history
      this.addMessage(conversationId, {
        role: 'user',
        content: userMessage
      });

      // Get conversation history
      const messages = this.getConversationHistory(conversationId);

      // Prepare messages for OpenAI API (exclude timestamps)
      const apiMessages = messages.map(({ role, content }) => ({ role, content }));

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: this.config.model,
        messages: apiMessages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        stream: false
      });

      const assistantResponse = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';

      // Add assistant response to history
      this.addMessage(conversationId, {
        role: 'assistant',
        content: assistantResponse
      });

      return assistantResponse;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          return 'I apologize, but the OpenAI API is not properly configured. Please check the API key configuration.';
        }
        if (error.message.includes('rate limit')) {
          return 'I apologize, but I\'m currently experiencing high demand. Please try again in a moment.';
        }
        if (error.message.includes('quota')) {
          return 'I apologize, but the API quota has been exceeded. Please try again later.';
        }
      }

      return 'I apologize, but I encountered an error while processing your request. Please try again.';
    }
  }

  // Stream AI response (for real-time typing effect)
  async *streamResponse(conversationId: string, userMessage: string): AsyncGenerator<string, void, unknown> {
    try {
      // Validate API key
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        yield 'OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your environment variables.';
        return;
      }

      // Initialize conversation if needed
      this.initializeConversation(conversationId);

      // Add user message to history
      this.addMessage(conversationId, {
        role: 'user',
        content: userMessage
      });

      // Get conversation history
      const messages = this.getConversationHistory(conversationId);

      // Prepare messages for OpenAI API
      const apiMessages = messages.map(({ role, content }) => ({ role, content }));

      // Call OpenAI API with streaming
      const stream = await openai.chat.completions.create({
        model: this.config.model,
        messages: apiMessages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        stream: true
      });

      let fullResponse = '';

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          yield content;
        }
      }

      // Add complete assistant response to history
      if (fullResponse) {
        this.addMessage(conversationId, {
          role: 'assistant',
          content: fullResponse
        });
      }
    } catch (error) {
      console.error('OpenAI Streaming Error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          yield 'I apologize, but the OpenAI API is not properly configured. Please check the API key configuration.';
        } else if (error.message.includes('rate limit')) {
          yield 'I apologize, but I\'m currently experiencing high demand. Please try again in a moment.';
        } else if (error.message.includes('quota')) {
          yield 'I apologize, but the API quota has been exceeded. Please try again later.';
        } else {
          yield 'I apologize, but I encountered an error while processing your request. Please try again.';
        }
      }
    }
  }

  // Update system prompt
  updateSystemPrompt(conversationId: string, newPrompt: string): void {
    this.config.systemPrompt = newPrompt;
    const history = this.conversationHistory.get(conversationId);
    if (history && history.length > 0 && history[0].role === 'system') {
      history[0].content = newPrompt;
      history[0].timestamp = new Date();
    }
  }

  // Export conversation history
  exportConversation(conversationId: string): ChatMessage[] {
    return this.getConversationHistory(conversationId);
  }

  // Import conversation history
  importConversation(conversationId: string, messages: ChatMessage[]): void {
    this.conversationHistory.set(conversationId, messages);
  }

  // Get conversation summary
  async getConversationSummary(conversationId: string): Promise<string> {
    const history = this.getConversationHistory(conversationId);
    if (history.length <= 1) return 'New conversation';

    const recentMessages = history.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');
    
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Summarize this conversation in 5-10 words for a chat title.'
          },
          {
            role: 'user',
            content: recentMessages
          }
        ],
        max_tokens: 50,
        temperature: 0.3
      });

      return completion.choices[0]?.message?.content || 'Chat conversation';
    } catch (error) {
      console.error('Error generating summary:', error);
      return 'Chat conversation';
    }
  }
}

// Create singleton instance
export const openAIService = new OpenAIService();