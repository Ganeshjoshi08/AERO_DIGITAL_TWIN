import type { DigitalTwinOutput } from '../types/digitalTwin';

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const DEFAULT_API_URL = isLocal ? 'http://127.0.0.1:8000' : 'https://aerotwin-api.onrender.com';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_URL;

export interface RagDiagnosisResponse {
  status: 'success' | 'error' | 'fallback';
  answer: string;
  source?: string;
  quota_exceeded?: boolean;
  elapsed_time?: number;
  total_tokens?: number;
  workflow_run_id?: string;
  prompt_context?: string;
  predicted_rul?: string;
  error?: string;
}

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

/**
 * Auto-diagnoses the current engine state using the Dify AI RAG workflow.
 */
export async function fetchAutoDiagnosis(predictedRul?: string): Promise<RagDiagnosisResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/ai/rag/auto-diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(predictedRul ? { predicted_rul: predictedRul } : {})
  });
  if (!response.ok) {
    throw new Error(`RAG Diagnosis error: ${response.statusText} (${response.status})`);
  }
  return response.json();
}

/**
 * Sends a custom query with predicted RUL to the Dify AI RAG workflow.
 */
export async function queryCustomRag(question: string, predictedRul?: string): Promise<RagDiagnosisResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/ai/rag/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_question: question.slice(0, 240),
      predicted_rul: predictedRul || '180'
    })
  });
  if (!response.ok) {
    throw new Error(`RAG Query error: ${response.statusText} (${response.status})`);
  }
  return response.json();
}

