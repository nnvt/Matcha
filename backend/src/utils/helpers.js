import db from '../models/index';
const { OAuth2Client } = require("google-auth-library");
const Image = require("../service/imageService");
const Tag = require("../service/tagService");
const OAuth2 = new OAuth2Client(process.env.CLIENT_ID);

const prepareUserData = async (users) => {
    const parsedUsers = JSON.parse(users);

    return Promise.all(
        parsedUsers.map(async (user) => {
            const userObject = { ...user };

            userObject.tags = JSON.parse(await Tag.findUserTags(user.id));

            return userObject;
        })
    );
};


const filterBody = async (body) => {
    try {
        const user = { ...body };
        Object.keys(user).forEach((field) => {
            if (!field.includes("password")) {
                user[field] = user[field].toString().trim().toLowerCase();
            }
        });
        return user;
    } catch (e) {
        throw new Error("Failed to filter body: " + e.message);
    }
};


const getPayload = async (tokenId) => {
    try {
        const ticket = await OAuth2.verifyIdToken({
            idToken: tokenId,
            audience: process.env.CLIENT_ID,
        });
        return ticket.getPayload();
    } catch (e) {
        throw new Error("Failed to get payload from Google account: " + e.message);
    }
};


const getAge = (DOB) => {
    const today = new Date();
    const birthday = new Date(DOB);
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }
    return age;
};


const msgsError = (code) => {
    switch (code) {
        case "LIMIT_FILE_SIZE":
            return new Error("The file must be less than 2MB!");
        case "LIMIT_UNEXPECTED_FILE":
            return new Error("Unexpected fields to get files from!");
        default:
            return new Error("An error occurred while validating uploaded files!");
    }
};
// Tạo phạm vi giá trị cho khoảng cách với các giá trị tối thiểu và tối đa mặc định nếu đầu vào không hợp lệ.
const getRangeDistance = (minDistance, maxDistance) => ({
    min: (minDistance >= 0 && minDistance <= 1000) ? parseInt(minDistance) : 0,
    max: (maxDistance >= 0 && maxDistance <= 1000) ? parseInt(maxDistance) : 1000,
});

// Tạo phạm vi giá trị cho độ tuổi với giới hạn tối thiểu là 18 và tối đa là 60.
const getRangeAge = (minAge, maxAge) => ({
    min: (minAge >= 18 && minAge <= 60) ? parseInt(minAge) : 18,
    max: (maxAge >= 18 && maxAge <= 60) ? parseInt(maxAge) : 60,
});

// Tạo phạm vi giá trị cho độ nổi tiếng với giới hạn giá trị từ 0 đến 100.
const getRangeFame = (minFame, maxFame) => ({
    min: (minFame >= 0 && minFame <= 100) ? parseInt(minFame) : 0,
    max: (maxFame >= 0 && maxFame <= 100) ? parseInt(maxFame) : 100,
});

module.exports = {
    prepareUserData,
    filterBody,
    getPayload,
    getAge,
    msgsError,
    getRangeAge,
    getRangeDistance,
    getRangeFame
}