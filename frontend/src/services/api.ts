import type { DigitalTwinOutput } from '../types/digitalTwin';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Fetches the latest DigitalTwinOutput state from the FastAPI REST server.
 * Serves as the initial dashboard state on page mount.
 */
export async function fetchEngineState(): Promise<DigitalTwinOutput> {
  const response = await fetch(`${API_BASE_URL}/api/v1/engine/state`);
  if (!response.ok) {
    throw new Error(`AeroTwin API error: ${response.statusText} (${response.status})`);
  }
  return response.json();
}
