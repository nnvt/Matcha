import socketIOClient from "socket.io-client";

class get_socket_connection {
  constructor() {
    const URL = "https://matchaa-backend-7bfca7ce8452.herokuapp.com";
    this.socket = socketIOClient(URL);
  }

  get_socket() {
    return this.socket;
  }
}

const socket = new get_socket_connection();
const socketConn = socket.get_socket();

export { socketConn };
