class DumbWebSocket extends WebSocket {
  constructor(url: string) {
    super(url);
    this.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (!(<any>this)[data.order]) {
        console.error("unknown order : " + data.order);
        return;
      }
      (<any>this)[data.order](data);
    });
  }
  ping(data: any) {
    this.send("pong");
  }
  getKnownUsersSharingIp(data: any) {}
}

let socket: DumbWebSocket;

let pingTimeout: number;
function heartbeat(this: any) {
  clearTimeout(pingTimeout);

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  pingTimeout = setTimeout(() => {
    this.terminate();
    console.warn("Connection timed out");
  }, 30000 + 1000);
}

export function wsConnect(url: string) {
  return new Promise((resolve, reject) => {
    socket = new DumbWebSocket("ws://" + url);
    socket.onopen = function (event) {
      heartbeat.bind(socket)();
      resolve(event);
    };

    // Listen for messages
    socket.addEventListener("message", function (event) {
      console.log("Message from server ", JSON.parse(event.data));
    });

    socket.addEventListener("error", function (event) {
      reject(event);
    });
  });
}

export function getSocket() {
  return socket;
}
