import React, { useState } from 'react';
import { SettingsModal } from './SettingsModal';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar placeholder */}
      <aside className="w-64 bg-gray-800 p-4 hidden md:flex flex-col">
        <h2 className="text-xl font-bold mb-4 flex-1">Chat History</h2>
        {/* List of history items would go here */}
        
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="mt-auto flex items-center justify-center p-3 w-full bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 transition-colors"
        >
          ⚙️ Settings
        </button>
      </aside>

      <main className="flex-1 flex flex-col relative">
        <header className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-center flex-1">Obsidian RAG Q&A</h1>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="md:hidden text-2xl"
          >
            ⚙️
          </button>
        </header>
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

