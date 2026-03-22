import React from 'react';
import { ChevronDown, FileSearch, Sparkles } from 'lucide-react';
import type { RagTrace } from '../hooks/useChatStream';

interface RagTracePanelProps {
  trace: RagTrace;
}

export const RagTracePanel: React.FC<RagTracePanelProps> = ({ trace }) => {
  return (
    <details className="cg-rag-panel" open>
      <summary className="cg-rag-summary">
        <span className="cg-rag-summary-left">
          <FileSearch className="h-3.5 w-3.5" />
          <span>RAG retrieval flow</span>
        </span>
        <span className="cg-rag-badge">{trace.retrieved_count} files</span>
        <ChevronDown className="cg-rag-chevron h-4 w-4" />
      </summary>

      <div className="cg-rag-body">
        <ol className="cg-rag-steps">
          <li className="is-done">
            <span className="cg-rag-step-dot" />
            <div>
              <p>Embed your query and run pgvector similarity search.</p>
            </div>
          </li>
          <li className="is-done">
            <span className="cg-rag-step-dot" />
            <div>
              <p>Select top matching files and build context for generation.</p>
            </div>
          </li>
          <li>
            <span className="cg-rag-step-dot" />
            <div>
              <p className="cg-rag-step-title">
                <Sparkles className="h-3.5 w-3.5" />
                Generate grounded answer with citations
              </p>
            </div>
          </li>
        </ol>

        <div className="cg-rag-files">
          <p className="cg-rag-files-title">Retrieved files</p>
          {trace.files.length === 0 ? (
            <p className="cg-rag-files-empty">No files were retrieved.</p>
          ) : (
            <ul>
              {trace.files.map((file, idx) => (
                <li key={`${file.filename}-${idx}`}>
                  <span className="cg-rag-file-name">{file.filename}</span>
                  <span className="cg-rag-file-meta">
                    {typeof file.score === 'number' ? `score ${(1 - file.score).toFixed(3)}` : 'score n/a'}
                    {file.source_path ? ` · ${file.source_path}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </details>
  );
};
