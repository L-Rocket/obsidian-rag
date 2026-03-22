import { useState, useCallback } from 'react';
import { fetchWithAuth } from '../api/interceptor';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: any[];
};

export function useChatStream() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const conversationId = null; // Statically null for now, can implement conversation selection later

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
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (!dataStr) continue;
            try {
              const data = JSON.parse(dataStr);
              if (data.chunk) {
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMsgId 
                    ? { ...msg, content: msg.content + data.chunk }
                    : msg
                ));
              } else if (Array.isArray(data)) {
                // Sources array
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMsgId 
                    ? { ...msg, sources: data }
                    : msg
                ));
              }
            } catch (e) {
              console.error('Error parsing SSE data', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  return { messages, sendMessage, isLoading };
}
