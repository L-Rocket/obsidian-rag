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
      <div className="flex-1 w-full overflow-y-auto pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col h-full items-center justify-center text-gray-400 px-4 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-3xl">O</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-200">How can I help you today?</h2>
            <p className="max-w-md text-[15px] leading-relaxed">
              Ask me anything about your Obsidian vault. I'll search your notes and synthesize an answer.
            </p>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} {...msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent pt-6">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </Layout>
  );
};
