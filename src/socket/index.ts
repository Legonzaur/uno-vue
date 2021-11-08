class DumbWebSocket extends WebSocket {
  pingTimeout: number = 0;
  constructor(url: string) {
    super(url);
    this.onmessage = (event) => {
      console.log("Message from server ", JSON.parse(event.data));
      const data = JSON.parse(event.data);
      if (!(<any>this)[data.order]) {
        console.error("unknown order : " + data.order);
        return;
      }
      (<any>this)[data.order](data);
    };

    this.onopen = (event) => {
      this.heartbeat();
    };
  }

  heartbeat(this: any) {
    clearTimeout(this.pingTimeout);

    this.pingTimeout = setTimeout(() => {
      this.close();
      console.warn("Connection timed out");
    }, 30000 + 1000);
  }

  ping() {
    this.send("pong");
    this.heartbeat();
  }
  getKnownUsersSharingIp(data: any) {}
}

let socket: DumbWebSocket;

export function wsConnect(url: string) {
  return new Promise((resolve, reject) => {
    socket = new DumbWebSocket("ws://" + url);
    socket.addEventListener("error", function (event) {
      reject(event);
    });
    resolve(socket);
  });
}

export function getSocket() {
  return socket;
}
