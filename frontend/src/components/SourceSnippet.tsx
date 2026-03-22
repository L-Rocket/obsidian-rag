import React from 'react';
import { FileText } from 'lucide-react';

interface SourceSnippetProps {
  source: {
    filename: string;
    metadata?: Record<string, unknown>;
    score?: number | null;
  };
}

export const SourceSnippet: React.FC<SourceSnippetProps> = ({ source }) => {
  const sourcePath = typeof source.metadata?.source_path === 'string' ? source.metadata.source_path : '';
  const score = typeof source.score === 'number' ? (1 - source.score).toFixed(3) : null;

  return (
    <div className="cg-source-chip" title={sourcePath || source.filename}>
      <FileText className="h-3.5 w-3.5" />
      <div className="cg-source-chip-text">
        <span className="cg-source-chip-name">{source.filename}</span>
        <span className="cg-source-chip-meta">
          {score ? `score ${score}` : 'score n/a'}
          {sourcePath ? ` · ${sourcePath}` : ''}
        </span>
      </div>
    </div>
  );
};
