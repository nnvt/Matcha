import db from '../models/index';

const findnotif = async (id, userid) => {
    try {
        const result = await db.notifications.findOne({
            where: {
                id: id,
                to_user: userid
            }
        });

        return result ? result : null;
    } catch (error) {
        throw error;
    }
}

const create = async (notification) => {
    try {
        await db.notifications.create({
            content: notification.content,
            to_user: notification.to,
            from_user: notification.from
        });
    } catch (error) {
        throw error;
    }
}

const getCountUnreadNotif = async (userid) => {
    try {
        const count = await db.notifications.count({
            where: {
                to_user: userid,
                seen: false
            }
        });

        return count;
    } catch (error) {
        throw error;
    }
}

const getUserNotifications = async (userid) => {
    try {

        const notifications = await db.notifications.findAll({
            where: { to_user: userid },
            include: [
                {
                    model: db.users,
                    as: 'fromUser',
                    attributes: ['id', 'firstname', 'lastname', 'username'],
                    required: true,
                    include: [
                        {
                            model: db.images,
                            as: 'profileImage',
                            attributes: ['url'],
                            where: { profile: true },
                            required: false
                        }
                    ]
                }
            ],
            attributes: ['id', 'content', 'seen', 'createdAt', 'from_user'],
            order: [['createdAt', 'DESC']],
        });

        return notifications;
    } catch (error) {
        throw error;
    }
}

const seenNotifUser = async (id, userid) => {
    try {
        await db.notifications.update(
            { seen: true },
            {
                where: {
                    id: id,
                    to_user: userid,
                },
            }
        );
    } catch (error) {
        throw error;
    }
}

const seenAllNotifUser = async (userid) => {
    try {
        await db.notifications.update(
            { seen: true },
            {
                where: {
                    to_user: userid,
                },
            }
        );
    } catch (error) {
        throw error;
    }
}

const delNotifUser = async (id, userid) => {
    try {
        await db.notifications.destroy({
            where: {
                id: id,
                to_user: userid,
            },
        });
    } catch (error) {
        throw error;
    }
};

const delAllNotifUser = async (userid) => {
    try {

        await db.notifications.destroy({
            where: {
                to_user: userid,
            },
        });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findnotif, create, getCountUnreadNotif, getUserNotifications, seenNotifUser, seenAllNotifUser, delNotifUser, delAllNotifUser
}