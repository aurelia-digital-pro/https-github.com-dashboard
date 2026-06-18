/**
 * Binance Live WebSocket Connection Manager.
 * Subscribes to tickers for real-time portfolio and screener syncing.
 */
export class BinanceWS_Manager {
  private ws: WebSocket | null = null;
  private url = 'wss://stream.binance.com:9443/ws/!ticker@arr';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private onMessageCallback: (data: any) => void;
  private isClosedIntentional = false;

  constructor(onMessage: (data: any) => void) {
    this.onMessageCallback = onMessage;
  }

  public connect(): void {
    if (typeof window === 'undefined') return;

    this.isClosedIntentional = false;
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        // console.log('Aurelia Connected to Binance WebSocket Stream.');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          this.onMessageCallback(raw);
        } catch (e) {
          // Silent catch parsing error
        }
      };

      this.ws.onclose = () => {
        if (!this.isClosedIntentional) {
          this.reconnect();
        }
      };

      this.ws.onerror = (err) => {
        // console.warn('Binance WS error:', err);
        this.ws?.close();
      };
    } catch (e) {
      this.reconnect();
    }
  }

  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      // console.warn('Binance WebSocket unreachable. Relying on polling backend emulation.');
      return;
    }

    this.reconnectAttempts++;
    setTimeout(() => {
      this.connect();
    }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1));
  }

  public disconnect(): void {
    this.isClosedIntentional = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
