import db from '../models/index';

const prepareUserData = async (users) => {
    return Promise.all(
        users.map(async (item) => {

            const userObject = { ...item };

            userObject.tags = await db.tags.findAll({
                include: [
                    {
                        model: db.users_tags,
                        as: 'userTags',  // Alias cho bảng trung gian
                        where: { user_id: item.id },
                        required: true,
                    }
                ],
                attributes: ['*'],
            });

            return userObject;
        })
    );
};

module.exports = {
    prepareUserData
}