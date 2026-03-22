import React, { useState } from 'react';
import { SettingsModal } from './SettingsModal';
import { Settings, MessageSquare, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-[#212121] text-gray-100 font-sans selection:bg-blue-500/30">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-[260px] bg-[#171717] p-3 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center gap-2 px-3 py-2 mb-4 text-white/90">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">
            O
          </div>
          <span className="font-semibold tracking-wide">Obsidian RAG</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          <h3 className="px-3 text-xs font-semibold text-gray-500 mb-2 mt-4 uppercase tracking-wider">History</h3>
          {/* Placeholder for actual history mapping */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#2f2f2f] text-sm text-gray-200 transition-colors">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            <span className="truncate">Current Conversation</span>
          </button>
        </div>
        
        <div className="mt-auto pt-4 space-y-1 border-t border-white/10">
          <button 
            onClick={() => { setIsSettingsOpen(true); setIsSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#2f2f2f] text-sm text-gray-300 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-sm text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden bg-[#212121]">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-3 border-b border-white/10 bg-[#212121] sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-medium text-gray-200">Obsidian RAG</span>
          <div className="w-10"></div> {/* Spacer for centering */}
        </header>

        <div className="flex-1 overflow-hidden relative flex flex-col items-center">
          {children}
        </div>
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

