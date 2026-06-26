const WORKER_URL = 'https://zenithopensourceprojects-production.up.railway.app';
const CHAT_TIMEOUT = 15000;

export const sendChatMessage = async (messages) => {
  const body = {
    messages: messages.map((m) => ({
      sender: m.role === 'user' ? 'user' : 'assistant',
      content: m.text,
    })),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHAT_TIMEOUT);

  try {
    const response = await fetch(`${WORKER_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 429) throw new Error('Rate limited. Please wait a moment.');
      if (response.status === 408) throw new Error('Request timed out. Please try again.');
      throw new Error('AI service is unavailable. Please try again later.');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Request timed out. Please try again.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
