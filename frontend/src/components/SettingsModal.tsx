import React, { useState, useEffect } from 'react';
import { fetchSettings, updateSettings, triggerIngest } from '../api/client';
import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<Record<string, string>>({
    OBSIDIAN_VAULT_PATH: '',
    CHAT_API_BASE: '',
    CHAT_API_KEY: '',
    CHAT_MODEL: '',
    EMBEDDING_API_BASE: '',
    EMBEDDING_API_KEY: '',
    EMBEDDING_MODEL: ''
  });
  const [loading, setLoading] = useState(false);
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      setSettings(prev => ({ ...prev, ...data }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateSettings(settings);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleIngest = async () => {
    setIngestStatus('Ingesting...');
    try {
      const res = await triggerIngest();
      setIngestStatus(res.message || 'Ingestion complete!');
    } catch (e) {
      setIngestStatus('Ingestion failed.');
      console.error(e);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
      <div className="bg-[#2f2f2f] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-white/10">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-semibold text-gray-100">Settings</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
          {/* General */}
          <section>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">General</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Obsidian Vault Absolute Path</label>
                <input
                  type="text"
                  value={settings.OBSIDIAN_VAULT_PATH || ''}
                  onChange={(e) => handleChange('OBSIDIAN_VAULT_PATH', e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-white/10 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  placeholder="/Users/name/Documents/Vault"
                />
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={handleIngest}
                    className="text-sm bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Trigger Ingestion
                  </button>
                  {ingestStatus && <span className="text-sm text-green-400 font-medium">{ingestStatus}</span>}
                </div>
              </div>
            </div>
          </section>

          {/* Chat Model */}
          <section>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Chat Model (Generation)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">API Base URL</label>
                <input
                  type="text"
                  value={settings.CHAT_API_BASE || ''}
                  onChange={(e) => handleChange('CHAT_API_BASE', e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-white/10 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Model Name</label>
                <input
                  type="text"
                  value={settings.CHAT_MODEL || ''}
                  onChange={(e) => handleChange('CHAT_MODEL', e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-white/10 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">API Key</label>
                <input
                  type="password"
                  value={settings.CHAT_API_KEY || ''}
                  onChange={(e) => handleChange('CHAT_API_KEY', e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-white/10 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Embedding Model */}
          <section>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Embedding Model (Vector Search)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">API Base URL</label>
                <input
                  type="text"
                  value={settings.EMBEDDING_API_BASE || ''}
                  onChange={(e) => handleChange('EMBEDDING_API_BASE', e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-white/10 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Model Name</label>
                <input
                  type="text"
                  value={settings.EMBEDDING_MODEL || ''}
                  onChange={(e) => handleChange('EMBEDDING_MODEL', e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-white/10 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">API Key</label>
                <input
                  type="password"
                  value={settings.EMBEDDING_API_KEY || ''}
                  onChange={(e) => handleChange('EMBEDDING_API_KEY', e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-white/10 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-[#2a2a2a] rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
