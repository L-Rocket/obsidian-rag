import React from 'react';

interface SourceSnippetProps {
  source: {
    filename: string;
    metadata?: any;
  };
}

export const SourceSnippet: React.FC<SourceSnippetProps> = ({ source }) => {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-300">
      📄 {source.filename}
    </div>
  );
};
