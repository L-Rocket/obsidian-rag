import React from 'react';
import { Layout } from '../components/Layout';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { useChatStream } from '../hooks/useChatStream';

export const ChatPage: React.FC = () => {
  const { messages, sendMessage, isLoading } = useChatStream();

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto pb-32">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            Ask a question to start the conversation
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} {...msg} />
          ))
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </Layout>
  );
};
