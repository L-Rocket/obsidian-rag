export const fetchHistory = async (conversationId: string) => {
  const res = await fetch(`http://localhost:8000/api/v1/conversations/${conversationId}/messages`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
};
