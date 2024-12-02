import db from '../models/index';

// Tìm một tin nhắn cụ thể trong chat
const findMessage = async (message, user_id, chat_id) => {
    try {
        const result = await db.messages.findOne({
            where: {
                message: message,
                user_id: user_id,
                chat_id: chat_id
            }
        });

        return result ? result : null;
    } catch (error) {
        throw error;
    }
};

// Tạo phòng chat mới giữa hai người dùng
const createRoomChat = async (user1, user2) => {
    try {
        await db.chat.create({
            user_id1: user1,
            user_id2: user2
        });
    } catch (error) {
        throw error;
    }
};

// Xóa phòng chat giữa hai người dùng
const deleteRoomChat = async (user1, user2) => {
    try {
        await db.chat.destroy({
            where: {
                user_id1: user1,
                user_id2: user2
            }
        });
    } catch (error) {
        throw error;
    }
};

// Tải toàn bộ tin nhắn của một phòng chat
const loadMessagesRoom = async (chat_id) => {
    try {
        const result = await db.messages.findAll({
            where: {
                chat_id: chat_id
            }
        });

        return JSON.stringify(result);
    } catch (error) {
        throw error;
    }
};

// Tạo tin nhắn mới
const createMessage = async (message) => {
    try {
        // Tạo tin nhắn mới trong bảng messages
        await db.messages.create({
            message: message.message,
            user_id: message.user_id,
            chat_id: message.chat_id
        });

        // Tìm lại tin nhắn vừa tạo và trả về
        const createdMessage = await findMessage(message.message, message.user_id, message.chat_id);
        return createdMessage;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createRoomChat,
    deleteRoomChat,
    loadMessagesRoom,
    createMessage,
    findMessage
};
