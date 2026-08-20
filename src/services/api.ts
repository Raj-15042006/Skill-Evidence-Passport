/// <reference types="vite/client" />
const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || '/api';

export async function loginWithAPI(email: string, password?: string, role?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Authentication failed');
    }
    return await res.json();
  } catch (err) {
    console.warn('Backend API server not reachable, using local state fallback.', err);
    return null;
  }
}

export async function getBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch {
    return { status: 'DEGRADED', database: 'LocalState' };
  }
}
