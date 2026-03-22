import React, { useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { useChatStream } from '../hooks/useChatStream';

export const ChatPage: React.FC = () => {
  const { messages, sendMessage, isLoading } = useChatStream();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Layout>
      <div className="cg-chat-root">
        <div className="cg-chat-scroll">
          {messages.length === 0 ? (
            <div className="cg-empty-wrap">
              <div className="cg-empty-card">
                <div className="cg-empty-head">
                  <div className="cg-empty-logo">O</div>
                  <h2>How can I help you today?</h2>
                  <p>
                    Ask anything about your Obsidian vault. I will retrieve relevant notes and synthesize an actionable answer.
                  </p>
                </div>
                <p className="cg-empty-foot">
                  Start with a question, task, or topic you want grounded in your local notes.
                </p>
              </div>
            </div>
          ) : (
            <div className="cg-message-list">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} {...msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="cg-input-fade" />
        <div className="cg-input-slot">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </Layout>
  );
};
