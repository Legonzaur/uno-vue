export interface GameMessage {
  order: string;
  data: any;
  id: number;
}

class DumbWebSocket extends WebSocket {
  pingTimeout: number = 0;
  awaitingMessages: ((
    value: GameMessage | PromiseLike<GameMessage>
  ) => void)[] = [];
  messageId = 0;
  constructor(url: string) {
    super(url);
    this.onmessage = (event) => {
      if (event.data == "ping") {
        super.send("pong");
        this.heartbeat();
        return;
      }

      const data = JSON.parse(event.data);
      console.log(
        new Date().toLocaleTimeString() + " Message from server ",
        data.order,
        data.data
      );
      if (data.id) {
        this.awaitingMessages[data.id](data);
        delete this.awaitingMessages[data.id];
      }
    };

    this.onopen = (event) => {
      this.heartbeat();
    };
  }

  heartbeat() {
    clearTimeout(this.pingTimeout);

    this.pingTimeout = setTimeout(() => {
      this.close();
      console.warn("Connection timed out");
    }, 30000 + 1000);
  }
  getKnownUsersSharingIp(data: any) {}

  send(order: string, data: any = null) {
    super.send(JSON.stringify({ order, data, id: ++this.messageId }));
    return new Promise<GameMessage>((resolve, reject) => {
      if (this.awaitingMessages[this.messageId]) {
        throw "duplicate messageId : " + this.messageId;
      }
      this.awaitingMessages[this.messageId] = resolve;
    });
  }
}

let socket: DumbWebSocket;

export function wsConnect(url: string) {
  return new Promise<WebSocket>((resolve, reject) => {
    socket = new DumbWebSocket("ws://" + url);
    socket.onerror = (error) => {
      reject(error);
    };
    socket.onopen = () => {
      resolve(socket);
    };
  });
}

export function getSocket() {
  return socket;
}
