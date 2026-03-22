import React, { useState } from 'react';
import { SettingsModal } from './SettingsModal';
import { Settings, MessageSquare, LogOut, Menu, PanelLeftClose, PanelLeftOpen, PenSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="cg-shell">
      {isSidebarOpen && <div className="cg-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`cg-sidebar ${isSidebarCollapsed ? 'is-collapsed' : ''} ${isSidebarOpen ? 'is-open' : ''}`}>
        <div className="cg-sidebar-header">
          <div className="cg-brand">
            <div className="cg-brand-logo">O</div>
            {!isSidebarCollapsed && (
              <div className="cg-brand-text">
                <p className="cg-brand-title">Obsidian RAG</p>
                <p className="cg-brand-subtitle">Knowledge workspace</p>
              </div>
            )}
          </div>
          <button
            type="button"
            className="cg-icon-btn cg-desktop-only"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <button type="button" className="cg-new-chat" onClick={() => setIsSidebarOpen(false)}>
          <PenSquare className="h-4 w-4" />
          {!isSidebarCollapsed && <span>New chat</span>}
        </button>

        <div className="cg-history">
          {!isSidebarCollapsed && <h3 className="cg-history-title">History</h3>}
          <button type="button" className="cg-history-item">
            <MessageSquare className="h-4 w-4" />
            {!isSidebarCollapsed && <span className="truncate">Current conversation</span>}
          </button>
        </div>

        <div className="cg-sidebar-footer">
          <button
            type="button"
            onClick={() => {
              setIsSettingsOpen(true);
              setIsSidebarOpen(false);
            }}
            className="cg-side-action"
          >
            <Settings className="h-4 w-4" />
            {!isSidebarCollapsed && 'Settings'}
          </button>
          <button type="button" onClick={logout} className="cg-side-action is-danger">
            <LogOut className="h-4 w-4" />
            {!isSidebarCollapsed && 'Log out'}
          </button>
        </div>
      </aside>

      <main className="cg-main">
        <header className="cg-topbar">
          <button type="button" onClick={() => setIsSidebarOpen(true)} className="cg-icon-btn cg-mobile-only">
            <Menu className="h-5 w-5" />
          </button>
          <div className="cg-desktop-only">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="cg-icon-btn"
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>
          <span className="cg-topbar-title">Obsidian RAG</span>
          <div className="cg-topbar-spacer" />
        </header>

        <div className="cg-content">{children}</div>
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
