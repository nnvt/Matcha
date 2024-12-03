import db from '../models/index';

const find = async () => {
    try {
        const result = await db.tags.findAll();
        return result;
    } catch (error) {
        throw error;
    }
}

const findOne = async (where) => {
    try {
        const result = await db.tags.findOne({ where });
        return result ? { id: result.id, name: result.name } : null;
    } catch (error) {
        throw error;
    }
}

const findUserTags = async (userId) => {
    try {
        const result = await db.users_tags.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: db.tags,
                    as: 'tag',
                    attributes: ['*'],
                    required: true,
                },
                {
                    model: db.users,
                    as: 'user',
                    attributes: ['*'],
                    required: true,
                },
            ],
            attributes: [],
        });

        return result;
    } catch (error) {
        throw error;
    }
}

const findUserTag = async (where) => {
    try {
        const result = await db.users_tags.findOne({
            where: {
                tag_id: where.tag_id,
                user_id: where.user_id,
            },
        });

        return result ? result : null;
    } catch (error) {
        throw error;
    }
}

const save = async (tag) => {
    try {
        await db.tags.create(tag);

        const newTag = await db.tags.create(tag);

        const savedTag = await db.tags.findOne({
            where: { id: newTag.id },
        });

        return savedTag;
    } catch (error) {
        throw error;
    }
}

const saveUserTag = async (userId, tagId) => {
    try {
        const result = await db.users_tags.create({
            user_id: userId,
            tag_id: tagId
        });
        return result;
    } catch (error) {
        throw error;
    }
};


const deleteUserTag = async (tagId, userId) => {
    try {
        await db.users_tags.destroy({
            where: {
                tag_id: tagId,
                user_id: userId
            }
        });
    } catch (error) {
        throw error;
    }
}

const deleteUserTags = async (userId) => {
    try {
        await db.users_tags.destroy({
            where: {
                user_id: userId
            }
        });
    } catch (error) {
        throw error;
    }
}



module.exports = {
    find, findOne, findUserTags, findUserTag, save, saveUserTag, deleteUserTag, deleteUserTags
}