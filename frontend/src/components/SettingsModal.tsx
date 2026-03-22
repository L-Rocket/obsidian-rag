import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
    EMBEDDING_MODEL: '',
  });
  const [loading, setLoading] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [ingestProgress, setIngestProgress] = useState(0);
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!ingesting) return;

    const timer = window.setInterval(() => {
      setIngestProgress((prev) => {
        if (prev >= 90) return prev;
        const step = prev < 30 ? 6 : prev < 70 ? 3 : 1;
        return Math.min(90, prev + step);
      });
    }, 700);

    return () => window.clearInterval(timer);
  }, [ingesting]);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      setSettings((prev) => ({ ...prev, ...data }));
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
    setIngesting(true);
    setIngestProgress(5);
    setIngestStatus('Ingesting...');
    try {
      const res = await triggerIngest(settings.OBSIDIAN_VAULT_PATH);
      setIngestProgress(100);
      setIngestStatus(res.message || 'Ingestion complete!');
    } catch (e: unknown) {
      setIngestProgress(100);
      const message = e instanceof Error ? e.message : 'Ingestion failed.';
      setIngestStatus(message);
      console.error(e);
    } finally {
      window.setTimeout(() => {
        setIngesting(false);
        setIngestProgress(0);
      }, 450);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="cg-settings-overlay" onClick={onClose}>
      <div className="cg-settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cg-settings-header">
          <div>
            <h2>System Settings</h2>
            <p>Configure your vault path and model providers. Changes are applied for future requests.</p>
          </div>
          <button type="button" className="cg-settings-close" onClick={onClose} aria-label="Close settings">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="cg-settings-body">
          <section className="cg-settings-section">
            <h3>General</h3>
            <label htmlFor="obsidian-vault-path">Obsidian Vault Absolute Path</label>
            <div className="cg-settings-inline">
              <input
                id="obsidian-vault-path"
                value={settings.OBSIDIAN_VAULT_PATH || ''}
                onChange={(e) => handleChange('OBSIDIAN_VAULT_PATH', e.target.value)}
                placeholder="/Users/name/Documents/Vault"
                className="cg-settings-input"
              />
              <button type="button" className="cg-settings-btn is-muted" onClick={handleIngest} disabled={ingesting}>
                {ingesting ? 'Ingesting...' : 'Trigger Ingestion'}
              </button>
            </div>
            {(ingesting || ingestProgress > 0) && (
              <div className="cg-settings-progress" role="progressbar" aria-valuenow={ingestProgress} aria-valuemin={0} aria-valuemax={100}>
                <div className="cg-settings-progress-bar" style={{ width: `${ingestProgress}%` }} />
              </div>
            )}
            {ingestStatus && <p className="cg-settings-status">{ingestStatus}</p>}
          </section>

          <section className="cg-settings-section">
            <h3>Chat Model (Generation)</h3>
            <div className="cg-settings-grid">
              <div className="cg-settings-field">
                <label htmlFor="chat-api-base">API Base URL</label>
                <input
                  id="chat-api-base"
                  value={settings.CHAT_API_BASE || ''}
                  onChange={(e) => handleChange('CHAT_API_BASE', e.target.value)}
                  placeholder="https://api.openai.com/v1"
                  className="cg-settings-input"
                />
              </div>
              <div className="cg-settings-field">
                <label htmlFor="chat-model">Model Name</label>
                <input
                  id="chat-model"
                  value={settings.CHAT_MODEL || ''}
                  onChange={(e) => handleChange('CHAT_MODEL', e.target.value)}
                  placeholder="gpt-4o-mini"
                  className="cg-settings-input"
                />
              </div>
              <div className="cg-settings-field is-span-2">
                <label htmlFor="chat-api-key">API Key</label>
                <input
                  id="chat-api-key"
                  type="password"
                  value={settings.CHAT_API_KEY || ''}
                  onChange={(e) => handleChange('CHAT_API_KEY', e.target.value)}
                  placeholder="sk-..."
                  className="cg-settings-input"
                />
              </div>
            </div>
          </section>

          <section className="cg-settings-section">
            <h3>Embedding Model (Vector Search)</h3>
            <div className="cg-settings-grid">
              <div className="cg-settings-field">
                <label htmlFor="embedding-api-base">API Base URL</label>
                <input
                  id="embedding-api-base"
                  value={settings.EMBEDDING_API_BASE || ''}
                  onChange={(e) => handleChange('EMBEDDING_API_BASE', e.target.value)}
                  placeholder="http://localhost:11434/v1"
                  className="cg-settings-input"
                />
              </div>
              <div className="cg-settings-field">
                <label htmlFor="embedding-model">Model Name</label>
                <input
                  id="embedding-model"
                  value={settings.EMBEDDING_MODEL || ''}
                  onChange={(e) => handleChange('EMBEDDING_MODEL', e.target.value)}
                  placeholder="text-embedding-3-small"
                  className="cg-settings-input"
                />
              </div>
              <div className="cg-settings-field is-span-2">
                <label htmlFor="embedding-api-key">API Key</label>
                <input
                  id="embedding-api-key"
                  type="password"
                  value={settings.EMBEDDING_API_KEY || ''}
                  onChange={(e) => handleChange('EMBEDDING_API_KEY', e.target.value)}
                  placeholder="sk-..."
                  className="cg-settings-input"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="cg-settings-footer">
          <button type="button" className="cg-settings-btn is-muted" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="cg-settings-btn is-primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
