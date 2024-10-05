import db from '../models';

const findLike = async (liker, liked) => {
    try {
        const result = await db.history.findOne({
            where: {
                type: 'like',
                visitor: liker,
                visited: liked
            }
        });

        return result ? result : null;
    } catch (error) {
        throw error;
    }
}

const getVisitsHistory = async (userid) => {
    try {
        const result = await db.history.findAll({
            where: {
                type: 'view',
                visitor: userid
            },
            attributes: [],
            include: [{
                model: db.users,
                as: 'visitedUser',
                attributes: ['id', 'username', 'firstname', 'lastname', 'gender', 'age', 'fame', 'city', 'country'],
                include: [{
                    model: db.images,
                    as: 'profile',
                    attributes: ['url'],
                    where: { profile: true },
                    required: false
                }]
            }],
            group: ['db.history.visited']   
        });

        return result;
    } catch (error) {
        throw error;
    }
}

const getCountViews = async (userid) => {
    try {
        const result = await db.history.count({
            distinct: true,
            col: 'visitor', // Count distinct visitors
            where: {
                type: 'view',
                visited: userid
            }
        });

        return result; // Returns the count of distinct visitors
    } catch (error) {
        throw error; // Throw error for handling outside the function
    }
}

const getCountFollowing = async (userid) => {
    try {
        const result = await db.history.count({
            distinct: true,
            col: 'visited', // Count distinct users that were liked (visited)
            where: {
                type: 'like',
                visitor: userid
            }
        });

        return result; // Return the count of distinct users the user is following
    } catch (error) {
        throw error; // Throw error for handling outside the function
    }
}

const getCountFollowers = async (userid) => {
    try {
        const result = await db.history.count({
            distinct: true,
            col: 'visitor', // Count distinct visitors (followers)
            where: {
                type: 'like',
                visited: userid
            }
        });

        return result; // Return the count of distinct followers
    } catch (error) {
        throw error; // Throw error for handling outside the function
    }
}

const getUserFollowers = async (userid) => {
    try {
        const result = await db.history.findAll({
            where: {
                type: 'like',
                visited: userid
            },
            include: [{
                model: db.users,
                as: 'visitorUser',
                attributes: ['id', 'firstname', 'lastname', 'username', 'gender', 'city', 'country', 'age', 'fame'],
                include: [{
                    model: db.images,
                    as: 'profile',
                    attributes: ['url'],
                    where: { profile: true },
                    required: false
                }]
            }],
            distinct: true
        });

        return result;
    } catch (error) {
        throw error;
    }
}

const getUserFollowing = async (userid) => {
    try {
        const result = await db.history.findAll({
            where: {
                type: 'like',
                visitor: userid
            },
            attributes: [],
            include: [{
                model: db.users,
                as: 'visitedUser',
                attributes: ['id', 'firstname', 'lastname', 'username', 'gender', 'city', 'country', 'age', 'fame'],
                include: [{
                    model: db.images,
                    as: 'profile',
                    attributes: ['url'],
                    where: {
                        profile: true
                    },
                    required: false
                }]
            }],
            distinct: true
        });

        return result;
    } catch (error) {
        throw error;
    }
}

const like = async (liker, liked) => {
    try {
        const result = await db.history.create({
            type: 'like',
            visitor: liker,
            visited: liked
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const view = async (visitor, visited) => {
    try {
        const result = await db.history.create({
            type: 'view',
            visitor: visitor,
            visited: visited
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const unlike = async (liker, liked) => {
    try {
        const result = await db.history.destroy({
            where: {
                type: 'like',
                visitor: liker,
                visited: liked
            }
        });
        return result; // Số hàng bị xóa
    } catch (error) {
        throw error;
    }
}

const getUserViewers = async (userid) => {
    try {
        const result = await db.history.findAll({
            where: {
                type: 'view',  // Điều kiện 'view' cho lịch sử lượt xem
                visited: userid  // Người dùng được xem là 'userid'
            },
            include: [{
                model: db.users,  // Liên kết với bảng 'users'
                as: 'visitor',  // Alias cho 'visitor', người đã xem
                attributes: ['id', 'firstname', 'lastname', 'username', 'gender', 'city', 'country', 'age', 'fame'],  // Các trường cần lấy từ bảng 'users'
                include: [{
                    model: db.images,  // Liên kết với bảng 'images' để lấy ảnh đại diện
                    as: 'profile',  // Alias cho ảnh đại diện
                    attributes: ['url'],  // Chỉ lấy trường 'url' của ảnh
                    where: { profile: true },  // Điều kiện lấy ảnh đại diện
                    required: false  // Không bắt buộc phải có ảnh đại diện
                }]
            }],
            distinct: true  // Đảm bảo kết quả không trùng lặp
        });

        return result;
    } catch (error) {
        throw error;
    }
}
module.exports = {
    findLike, getVisitsHistory, getCountViews, getCountFollowing, getCountFollowers, getUserFollowers, getUserFollowing, getUserViewers, like, view, unlike
}