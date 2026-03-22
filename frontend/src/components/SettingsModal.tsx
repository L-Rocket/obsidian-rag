import React, { useState, useEffect } from 'react';
import { fetchSettings, updateSettings, triggerIngest } from '../api/client';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">System Settings</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-3 text-gray-300">General</h3>
            <label className="block text-sm font-medium text-gray-400 mb-1">Obsidian Vault Absolute Path</label>
            <input
              type="text"
              value={settings.OBSIDIAN_VAULT_PATH || ''}
              onChange={(e) => handleChange('OBSIDIAN_VAULT_PATH', e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="/Users/name/Documents/Vault"
            />
            <button
              onClick={handleIngest}
              className="mt-2 text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
            >
              Trigger Ingestion
            </button>
            {ingestStatus && <span className="ml-3 text-sm text-green-400">{ingestStatus}</span>}
          </div>

          <div>
            <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-3 mt-6 text-gray-300">Chat Model (Generation)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">API Base URL</label>
                <input
                  type="text"
                  value={settings.CHAT_API_BASE || ''}
                  onChange={(e) => handleChange('CHAT_API_BASE', e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded-md"
                  placeholder="https://api.openai.com/v1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Model Name</label>
                <input
                  type="text"
                  value={settings.CHAT_MODEL || ''}
                  onChange={(e) => handleChange('CHAT_MODEL', e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded-md"
                  placeholder="gpt-4o-mini"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">API Key</label>
                <input
                  type="password"
                  value={settings.CHAT_API_KEY || ''}
                  onChange={(e) => handleChange('CHAT_API_KEY', e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded-md"
                  placeholder="sk-..."
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-3 mt-6 text-gray-300">Embedding Model (Vector Search)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">API Base URL</label>
                <input
                  type="text"
                  value={settings.EMBEDDING_API_BASE || ''}
                  onChange={(e) => handleChange('EMBEDDING_API_BASE', e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded-md"
                  placeholder="http://localhost:11434/v1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Model Name</label>
                <input
                  type="text"
                  value={settings.EMBEDDING_MODEL || ''}
                  onChange={(e) => handleChange('EMBEDDING_MODEL', e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded-md"
                  placeholder="text-embedding-3-small"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">API Key</label>
                <input
                  type="password"
                  value={settings.EMBEDDING_API_KEY || ''}
                  onChange={(e) => handleChange('EMBEDDING_API_KEY', e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded-md"
                  placeholder="sk-..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
