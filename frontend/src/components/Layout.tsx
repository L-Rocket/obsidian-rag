import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar placeholder */}
      <aside className="w-64 bg-gray-800 p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-4">Chat History</h2>
        {/* List of history items would go here */}
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="bg-gray-800 p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-center">Obsidian RAG Q&A</h1>
        </header>
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </main>
    </div>
  );
};
