import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SourceSnippet } from './SourceSnippet';
import { RagTracePanel } from './RagTracePanel';
import { User, Bot } from 'lucide-react';
import type { RagTrace } from '../hooks/useChatStream';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ filename: string; metadata?: Record<string, unknown>; score?: number | null }>;
  ragTrace?: RagTrace;
}

export const ChatMessage: React.FC<MessageProps> = ({ role, content, sources, ragTrace }) => {
  const isUser = role === 'user';

  return (
    <div className="cg-msg-row-wrap">
      <div className={`cg-msg-row ${isUser ? 'is-user' : 'is-assistant'}`}>
        {!isUser && (
          <div className="cg-msg-avatar is-assistant">
            <Bot className="h-4 w-4" />
          </div>
        )}

        <div className={`cg-msg-body ${isUser ? 'is-user' : 'is-assistant'}`}>
          {isUser ? (
            <div className="cg-msg-bubble">
              <div className="cg-msg-text">{content}</div>
            </div>
          ) : (
            <div className="cg-md-wrap">
              {ragTrace && <RagTracePanel trace={ragTrace} />}
              <div className="cg-md prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            </div>
          )}

          {sources && sources.length > 0 && (
            <div className="cg-source-wrap">
              {sources.map((source, i) => (
                <SourceSnippet key={i} source={source} />
              ))}
            </div>
          )}
        </div>

        {isUser && (
          <div className="cg-msg-avatar is-user">
            <User className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
};
