const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function withTimeout(promise, ms = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await promise(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Calls POST /predict on the FastAPI backend.
 * @param {string} text
 * @returns {Promise<{text: string, predicted_emotion: string, confidence: number, all_probabilities: Record<string, number>}>}
 */
export async function predictEmotion(text) {
  const trimmed = (text || '').trim();

  if (!trimmed) {
    throw new ApiError('Please enter some text before analyzing.', 400);
  }

  try {
    const response = await withTimeout((signal) =>
      fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
        signal,
      })
    );

    if (!response.ok) {
      if (response.status >= 500) {
        throw new ApiError('The emotion model is temporarily unavailable. Please try again shortly.', response.status);
      }
      if (response.status === 422 || response.status === 400) {
        throw new ApiError('That text could not be processed. Try rephrasing it.', response.status);
      }
      throw new ApiError(`Request failed with status ${response.status}.`, response.status);
    }

    return await response.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.name === 'AbortError') {
      throw new ApiError('The request timed out. Check your connection and try again.', 408);
    }
    throw new ApiError('Could not reach the Manobhav AI backend. Is the server running?', 0);
  }
}

 
export async function checkHealth() {
  try {
    const response = await withTimeout((signal) => fetch(`${API_URL}/health`, { signal }), 8000);
    if (!response.ok) return { ok: false };
    const data = await response.json();
    return { ok: true, data };
  } catch {
    return { ok: false };
  }
}

export { API_URL };
