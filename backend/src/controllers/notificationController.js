import db from '../models/index';

exports.loadNotifs = async (req, res) => {
    const { userid } = req.body;

    try {
        // Fetch user notifications using Sequelize
        const notifications = await db.notifications.findAll({
            where: { user_id: userid },
        });

        // Count unread notifications
        const countUnread = await db.notifications.count({
            where: { user_id: userid, read: false },
        });

        return res.status(200).json({
            success: true,
            countUnread: countUnread,
            data: notifications, // Return notifications
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while loading notifications list, try later!",
        });
    }
};

exports.read = async (req, res) => {
    const { id } = req.params;
    const { userid } = req.body;

    try {
        // Find the specified notification for the user
        const notification = await db.notifications.findOne({
            where: { id: id, user_id: userid },
        });

        if (!notification) {
            return res.status(400).json({
                success: false,
                error: "Notification not found for the specified user!",
            });
        }

        // Update the notification to mark it as read
        await notification.update({ read: true });

        return res.status(200).json({
            success: true,
            message: "The specified notification has been marked as read!",
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while reading the specified notification, try later!",
        });
    }
};

exports.readAll = async (req, res) => {
    const { userid } = req.body;

    try {
        // Cập nhật tất cả thông báo của người dùng thành "đã đọc"
        const result = await db.notification.update(
            { status: 'read' },  // Cập nhật status thành "read" hoặc giá trị phù hợp
            { where: { user_id: userid } }  // Điều kiện: chỉ cập nhật các thông báo của người dùng này
        );

        // Kiểm tra nếu có thông báo được cập nhật
        if (result[0] > 0) {
            return res.status(200).json({
                success: true,
                message: "All notifications have been read!",
            });
        } else {
            // Nếu không có thông báo nào được cập nhật (có thể do không có thông báo hoặc tất cả đã được đọc)
            return res.status(400).json({
                success: false,
                error: "No notifications to mark as read!",
            });
        }
    } catch (e) {
        // Xử lý lỗi
        return res.status(400).json({
            success: false,
            error: "An error has occurred while reading all notifications, try later!",
        });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    const { userid } = req.body;

    try {
        // Find the notification to delete by id and user_id
        const notification = await db.notifications.findOne({
            where: { id: id, user_id: userid },
        });

        if (!notification) {
            return res.status(400).json({
                success: false,
                error: "Notification not found for the specified user!",
            });
        }

        // Delete the notification
        await notification.destroy();

        return res.status(200).json({
            success: true,
            message: "The specified notification has been deleted!",
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while deleting the specified notification, try later!",
        });
    }
};

exports.deleteAll = async (req, res) => {
    const { userid } = req.body;

    try {
        // Delete all notifications for the specified user
        const deletedCount = await db.notifications.destroy({
            where: { user_id: userid },
        });

        if (deletedCount === 0) {
            return res.status(400).json({
                success: false,
                error: "No notifications found to delete for the specified user!",
            });
        }

        return res.status(200).json({
            success: true,
            message: "All notifications have been deleted!",
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while deleting all notifications, try later!",
        });
    }
};