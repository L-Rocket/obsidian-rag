export const fetchHistory = async (conversationId: string) => {
  const res = await fetch(`http://localhost:8000/api/v1/conversations/${conversationId}/messages`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
};

export const fetchSettings = async () => {
  const res = await fetch('http://localhost:8000/api/v1/settings');
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
};

export const updateSettings = async (settings: Record<string, string>) => {
  const res = await fetch('http://localhost:8000/api/v1/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
};

export const triggerIngest = async () => {
  const res = await fetch('http://localhost:8000/api/v1/ingest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error('Failed to trigger ingestion');
  return res.json();
};
