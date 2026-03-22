import React from 'react';
import { SourceSnippet } from './SourceSnippet';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  sources?: any[];
}

export const ChatMessage: React.FC<MessageProps> = ({ role, content, sources }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`p-4 ${isUser ? 'bg-gray-800' : 'bg-gray-900'}`}>
      <div className="max-w-4xl mx-auto flex gap-4">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          {isUser ? '👤' : '🤖'}
        </div>
        <div className="flex-1 space-y-4">
          <div className="prose prose-invert max-w-none">
            {content.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </div>
          {sources && sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Sources:</h4>
              <div className="flex flex-wrap gap-2">
                {sources.map((source, i) => (
                  <SourceSnippet key={i} source={source} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
