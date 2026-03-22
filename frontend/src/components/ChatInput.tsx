import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2">
      <form 
        onSubmit={handleSubmit} 
        className="relative flex items-end w-full bg-[#2f2f2f] rounded-2xl border border-white/10 shadow-lg focus-within:border-white/20 focus-within:bg-[#383838] transition-colors"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Message Obsidian RAG..."
          className="w-full max-h-[200px] bg-transparent text-gray-100 placeholder-gray-400 px-4 py-3.5 resize-none focus:outline-none rounded-2xl"
          rows={1}
        />
        <div className="absolute right-2 bottom-2">
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className={`
              p-1.5 rounded-xl transition-all duration-200 flex items-center justify-center
              ${input.trim() && !disabled 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-white/10 text-white/30 cursor-not-allowed'}
            `}
          >
            <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </form>
      <div className="text-center mt-2">
        <p className="text-xs text-gray-500">RAG System based on local Obsidian Vault. AI can make mistakes.</p>
      </div>
    </div>
  );
};
