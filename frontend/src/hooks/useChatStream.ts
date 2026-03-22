import { useState, useCallback } from 'react';
import { fetchWithAuth } from '../api/interceptor';

export type RagTraceFile = {
  filename: string;
  source_path?: string;
  score?: number | null;
};

export type RagTrace = {
  stage: 'retrieve';
  retrieved_count: number;
  files: RagTraceFile[];
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: any[];
  ragTrace?: RagTrace;
};

export function useChatStream() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const upsertAssistantMessage = useCallback((assistantMsgId: string, updater: (msg: Message) => Message) => {
    setMessages(prev => prev.map(msg => (msg.id === assistantMsgId ? updater(msg) : msg)));
  }, []);

  const sendMessage = useCallback(async (query: string) => {
    setIsLoading(true);
    
    // Add user message immediately
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: query }]);
    
    // Setup assistant placeholder
    const assistantMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

    try {
      const response = await fetchWithAuth('http://localhost:8000/api/v1/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          conversation_id: conversationId,
        }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let activeEvent = 'message';

      const handleEvent = (eventName: string, dataStr: string) => {
        if (!dataStr) return;
        try {
          const data = JSON.parse(dataStr);

          if (eventName === 'conversation' && data.conversation_id) {
            setConversationId(data.conversation_id);
            return;
          }

          if (eventName === 'message' && data.chunk) {
            upsertAssistantMessage(assistantMsgId, msg => ({ ...msg, content: msg.content + data.chunk }));
            return;
          }

          if (eventName === 'trace' && data.stage === 'retrieve') {
            upsertAssistantMessage(assistantMsgId, msg => ({ ...msg, ragTrace: data }));
            return;
          }

          if (eventName === 'sources' && Array.isArray(data)) {
            upsertAssistantMessage(assistantMsgId, msg => ({ ...msg, sources: data }));
          }
        } catch (e) {
          console.error('Error parsing SSE data', e);
        }
      };

      const flushEvents = (chunkText: string, isFinal = false) => {
        buffer += chunkText;
        const parts = buffer.split('\n\n');
        if (!isFinal) {
          buffer = parts.pop() || '';
        } else {
          buffer = '';
        }

        for (const part of parts) {
          const lines = part.split('\n');
          let dataStr = '';
          for (const rawLine of lines) {
            const line = rawLine.trimEnd();
            if (line.startsWith('event: ')) {
              activeEvent = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              dataStr += line.slice(6);
            }
          }
          handleEvent(activeEvent, dataStr);
        }
      };
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          flushEvents(decoder.decode(value || new Uint8Array(), { stream: false }), true);
          break;
        }

        flushEvents(decoder.decode(value, { stream: true }));
      }
    } catch (error) {
      console.error('Streaming error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, upsertAssistantMessage]);

  return { messages, sendMessage, isLoading };
}
