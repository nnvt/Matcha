import db from '../models/index';

const jwt = require("jsonwebtoken");
const Users = {};

module.exports = (io) => {
    io.on("connection", (socket) => {

        // Event login
        socket.on("login", async (token) => {
            try {
                let decoded = jwt.verify(token, process.env.JWT_PKEY);
                // Check if user already exists in Users object, if not, create a new entry
                if (!Users[decoded.id]) Users[decoded.id] = [socket];
                else if (!Users[decoded.id].includes(socket)) Users[decoded.id].push(socket);

                // Send notifications
                await db.notifications.getUserNotifications(decoded.id)
                    .then(async (notifications) => {
                        socket.broadcast.to(Users[decoded.id][0].id).emit('notifications', {
                            'countUnread': await db.notifications.getCountUnreadNotif(decoded.id),
                            'data': JSON.parse(notifications)
                        });
                    });

                // Update user status to online
                await db.users.setStatus(decoded.id);
                socket.emit(`${decoded.id}-online-status`, { online: true });
            } catch (error) {
                console.error("Error decoding JWT or handling login: ", error);
                socket.emit("error", "Authentication failed!");
            }
        });

        // Event for reconnect
        socket.on("userConnected", async (token) => {
            try {
                let decoded = jwt.verify(token, process.env.JWT_PKEY);

                // Save socket if not already present
                if (!Users[decoded.id]) Users[decoded.id] = [socket];
                else if (!Users[decoded.id].includes(socket)) Users[decoded.id].push(socket);

                // Update user status
                await db.users.setStatus(decoded.id);
                socket.emit(`${decoded.id}-online-status`, { online: true });

                // Handle disconnection
                socket.on("disconnect", async () => {
                    // Remove the socket from the users' list
                    if (Users[decoded.id]) {
                        Users[decoded.id] = Users[decoded.id].filter(s => s !== socket);

                        // If no sockets left, set status to offline
                        if (Users[decoded.id].length === 0) {
                            delete Users[decoded.id];
                            await db.users.setStatus(decoded.id, false); // Set user status as offline in DB
                        }
                    }
                });
            } catch (error) {
                console.error("Error decoding JWT or handling user reconnect: ", error);
                socket.emit("error", "Authentication failed!");
            }
        });
        socket.on("isOnline", async (data) => {
            if (Users[data.userid]) {
                socket.emit(`${data.userid}-online-status`, { online: true });
            } else {
                await db.users.getStatus(data.userid).then((status) => {
                    socket.emit(`${data.userid}-online-status`, { online: false, status });
                });
            }
        });


        socket.on("notify", async (data) => {
            switch (data.type) {
                case "view":
                    await db.history.view(data.visitor, data.visited);
                    await db.users.setFamerating(data.visited);
                    await db.notifications.create({ content: "View your profile !", to: data.visited, from: data.visitor });
                    break;
                case "like":
                    await db.users.setFamerating(data.visited);
                    await db.notifications.create({ content: "Like your profile !", to: data.visited, from: data.visitor });
                    break;
                case "unlike":
                    await db.notifications.create({ content: "Unlike your profile !", to: data.visited, from: data.visitor });
                    break;
            }
            // Send notifications
            await db.notifications.getUserNotifications(data.visited)
                .then(async (notifications) => {
                    if (Users[data.visited]) {
                        socket.broadcast.to(Users[data.visited][0].id).emit('notifications', {
                            'countUnread': await db.notifications.getCountUnreadNotif(data.visited),
                            'data': JSON.parse(notifications)
                        });
                    }
                });
        });

        socket.on("report", async (data) => {
            // Update fame rating
            await db.users.setFamerating(data.reported);
        });

        socket.on("sendMessage", async (data) => {
            // Lưu tin nhắn vào cơ sở dữ liệu
            await db.messages.createMessage({ 'message': data.message, 'user_id': data.sender, 'chat_id': data.chat_id })
                .then((message) => {
                    if (Users[data.receiver]) {
                        // Gửi tin nhắn đến người nhận nếu họ đang online
                        socket.broadcast.to(Users[data.receiver][0].id).emit('newMessage', { 'message': message });
                    }
                })
            // Tạo thông báo cho người nhận về tin nhắn mới
            await db.notifications.create({ content: "Send you a message !", to: data.receiver, from: data.sender });
            await db.notifications.getUserNotifications(data.receiver)
                .then(async (notifications) => {
                    if (Users[data.receiver]) {
                        socket.broadcast.to(Users[data.receiver][0].id).emit('notifications', {
                            'countUnread': await db.notifications.getCountUnreadNotif(data.receiver),
                            'data': JSON.parse(notifications)
                        });
                    }
                });
        });

        socket.on("logout", async (data) => {
            if (Users[data.userid]) {
                // Xóa socket của người dùng khỏi danh sách
                delete Users[data.userid];
                await db.users.getStatus(data.userid).then((status) => {
                    // Cập nhật trạng thái của người dùng là offline
                    socket.emit(`${data.userid}-online-status`, { online: false, status });
                });
            }
        });

    });


};
