import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SourceSnippet } from './SourceSnippet';
import { User, Bot } from 'lucide-react';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  sources?: any[];
}

export const ChatMessage: React.FC<MessageProps> = ({ role, content, sources }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`w-full py-6 ${isUser ? '' : 'bg-[#212121]'}`}>
      <div className="max-w-3xl mx-auto px-4 flex gap-4 md:gap-6">
        {/* Avatar */}
        <div className={`
          w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0
          ${isUser ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}
        `}>
          {isUser ? <User className="w-5 h-5 md:w-6 md:h-6" /> : <Bot className="w-5 h-5 md:w-6 md:h-6" />}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 min-w-0 pt-1">
          {isUser ? (
            <div className="text-gray-100 whitespace-pre-wrap leading-relaxed text-[15px] md:text-base">
              {content}
            </div>
          ) : (
            <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-white/10 max-w-none text-gray-200 text-[15px] md:text-base">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )}
          
          {/* Sources */}
          {sources && sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
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
