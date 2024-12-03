const db = require('../models/index');

const findMatchers = async (userid) => {
    try {
        const result = await db.users.findAll({
            attributes: [
                'id',
                'firstname',
                'lastname',
                [db.sequelize.literal(`(SELECT url FROM images WHERE images.user_id = users.id AND images.profile = 1)`), 'profile']
            ],
            include: [
                {
                    model: db.matchers,
                    as: 'matchers',
                    where: db.sequelize.where(
                        db.sequelize.fn('if', db.sequelize.col('matchers.matcher'), db.sequelize.col('matchers.matched'), db.sequelize.col('matchers.matcher')),
                        userid
                    ),
                    required: true
                },
                {
                    model: db.chat,
                    as: 'chats',
                    where: {
                        [db.Sequelize.Op.or]: [
                            { user_id1: userid },
                            { user_id2: userid }
                        ]
                    },
                    attributes: ['id'],
                    required: true
                }
            ],
            group: ['users.id', 'chats.id']
        });

        return result;
    } catch (error) {
        throw error;
    }
};

// Tìm một cặp matcher-matched
const findMatch = async (matcher, matched) => {
    try {
        const result = await db.matchers.findOne({
            where: {
                matcher: matcher,
                matched: matched
            }
        });

        return result ? result : null;
    } catch (error) {
        throw error;
    }
};

// Thêm một cặp matcher-matched mới
const match = async (matcher, matched) => {
    try {
        await db.matchers.create({
            matcher: matcher,
            matched: matched
        });
    } catch (error) {
        throw error;
    }
};

// Xóa một cặp matcher-matched
const unmatch = async (matcher, matched) => {
    try {
        await db.matchers.destroy({
            where: {
                matcher: matcher,
                matched: matched
            }
        });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findMatchers,
    findMatch,
    match,
    unmatch
};
