import socketIOClient from "socket.io-client";

class get_socket_connection {
    constructor() {
        const URL = `${process.env.REACT_APP_API_URL}`;
        this.socket = socketIOClient(URL);
    }

    get_socket() {
        return this.socket;
    }
}

const socket = new get_socket_connection();
const socketConn = socket.get_socket();

export { socketConn };
