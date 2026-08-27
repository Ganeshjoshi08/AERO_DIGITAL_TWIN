import type { DigitalTwinOutput } from '../types/digitalTwin';

export type ConnectionStatus = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';

/**
 * Robust reconnecting WebSocket client for streaming live telemetry packets.
 */
export class TelemetryWebSocketService {
  private wsUrl: string;
  private ws: WebSocket | null = null;
  private onMessageCallback: (data: DigitalTwinOutput) => void;
  private onStatusCallback: (status: ConnectionStatus) => void;
  
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectInterval = 1000;
  private maxReconnectInterval = 10000;
  private shouldReconnect = true;

  constructor(
    onMessage: (data: DigitalTwinOutput) => void,
    onStatusChange: (status: ConnectionStatus) => void
  ) {
    this.wsUrl = import.meta.env.VITE_WS_URL || 'ws://127.0.0.1:8000/ws/telemetry';
    this.onMessageCallback = onMessage;
    this.onStatusCallback = onStatusChange;
  }

  /**
   * Establishes the WebSocket connection and sets listeners.
   */
  connect(): void {
    this.shouldReconnect = true;
    this.onStatusCallback('CONNECTING');

    if (this.ws) {
      this.ws.close();
    }

    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        this.onStatusCallback('CONNECTED');
        this.reconnectInterval = 1000; // Reset reconnection timing delay
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const parsed: DigitalTwinOutput = JSON.parse(event.data);
          this.onMessageCallback(parsed);
        } catch (e) {
          console.error('[TelemetryWS] Parse error in telemetry data frame:', e);
        }
      };

      this.ws.onclose = () => {
        this.onStatusCallback('DISCONNECTED');
        if (this.shouldReconnect) {
          this.triggerReconnect();
        }
      };

      this.ws.onerror = (e) => {
        console.error('[TelemetryWS] WebSocket error:', e);
      };
      
    } catch (err) {
      console.error('[TelemetryWS] Failed to connect WebSocket:', err);
      this.onStatusCallback('DISCONNECTED');
      this.triggerReconnect();
    }
  }

  private triggerReconnect(): void {
    if (this.reconnectTimeout) {
      return;
    }

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      // Exponential backoff up to 10s max retry gap
      this.reconnectInterval = Math.min(this.reconnectInterval * 2, this.maxReconnectInterval);
      this.connect();
    }, this.reconnectInterval);
  }

  /**
   * Cleanly closes the active socket connection and prevents reconnect timers.
   */
  close(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.onStatusCallback('DISCONNECTED');
  }
}
