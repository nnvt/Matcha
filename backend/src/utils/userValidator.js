import db from '../models/index';
const { fileSizeFilter } = require("./imageValidator");
const { validateTag } = require("./tagValidator");
const { getAge } = require("./helpers");
const { compare } = require("./genToken.js");

const validatefirstname = (firstname) => {
    const regex = /^[a-z]{3,}$/;

    if (!regex.test(firstname.toLowerCase())) {
        return new Error("The first name must contain letters only, with a minimum of 3 letters!");
    }

    if (firstname.length > 30) {
        return new Error("The first name is too long!");
    }

    return null;
}

const validatelastname = (lastname) => {
    const regex = /^[a-z]{3,}$/;

    if (!regex.test(lastname.toLowerCase())) {
        return new Error("The last name must contain letters only, with a minimum of 3 letters!");
    }

    if (lastname.length > 30) {
        return new Error("The last name is too long!");
    }

    return null;
}

const validateUsername = (username) => {
    const regex = /^[a-z]+(([-_.]?[a-z0-9])?)+$/;

    if (!regex.test(username.toLowerCase())) {
        return new Error("The username must contain letters or numbers and can include '-', '_', or '.' !");
    }

    if (username.length < 3 || username.length > 20) {
        return new Error("The username should be between 3 and 20 characters!");
    }

    return null;
}

const validateEmail = (email) => {
    const regex = /^[a-z0-9-_.]{1,50}@[a-z0-9-_.]{1,50}\.[a-z0-9]{2,10}$/;

    if (!regex.test(email.toLowerCase())) {
        return new Error("Invalid email address!");
    }

    return null;
}

const validatePassword = (password) => {
    const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_-]).{8,}$/;

    if (!regex.test(password)) {
        return new Error("The password should be a minimum of eight characters, include at least one uppercase letter, one lowercase letter, one number, and one special character!");
    }

    return null;
}

const validateGender = (gender) => {

    const validGenders = ["male", "female", "other"];


    if (!validGenders.includes(gender.toLowerCase().trim())) {
        return new Error("The gender must be either male, female, or other!");
    }

    return null;
}

const validateBirthday = (birthday) => {
    const date = new Date(birthday);

    if (!(date instanceof Date) || isNaN(date)) {
        return new Error("The birthday has an invalid format!");
    }

    return null;
}

const validateAge = (DOB) => {
    const birthday = new Date(DOB);
    const age = getAge(birthday);

    if (age < 18) {
        return new Error("Your age must be greater or equal to 18 years old!");
    }

    return null;
}

const validateLooking = (looking) => {
    const validGenders = ["male", "female", "other"];

    if (!validGenders.includes(looking.toLowerCase().trim())) {
        return new Error("The interesting gender must be either male, female, or other!");
    }

    return null;
}

const validateBio = (bio) => {
    const regex = /^([\w\s,.!?@#$^&*()\[\]'";:-_=+]){10,100}$/;

    if (!regex.test(bio.toLowerCase())) {
        return new Error("The biography must be at least 10 characters and no more than 100 characters!");
    }

    return null;
}

const isLatitude = (lang) => {
    return isFinite(lang) && Math.abs(lang) <= 90;
}

const isLongitude = (lat) => {
    return isFinite(lat) && Math.abs(lat) <= 180;
}

const emailExists = async (email) => {
    try {
        // Tìm kiếm người dùng theo email (chuyển email thành chữ thường)
        const user = await db.users.findOne({
            where: {
                email: email.toLowerCase()  // Chuyển email thành chữ thường trước khi tìm kiếm
            }
        });

        // Kiểm tra nếu không tìm thấy người dùng với email đó
        if (!user) {
            return null; // Nếu không có người dùng, trả về null
        }

        // Nếu tìm thấy người dùng, trả về người dùng
        return user;
    } catch (error) {
        // Xử lý lỗi khi không thể tìm kiếm
        throw new Error("Failed to validate the specified email, please try again later!");
    }
};

const isUniqueEmail = async (email) => {
    try {
        const user = await emailExists(email);

        if (user) {
            throw new Error("The email already exists!");
        }
        return;
    } catch (error) {
        throw new Error("An error has occurred while validating your email, please try again later!");
    }
}

const usernameExists = async (username) => {
    try {
        // Tìm kiếm người dùng theo username (chuyển thành chữ thường)
        const user = await db.users.findOne({
            where: {
                username: username.toLowerCase()  // Chuyển username thành chữ thường trước khi tìm kiếm
            }
        });

        // Kiểm tra nếu không tìm thấy người dùng
        if (!user) {
            return null; // Nếu không có người dùng, trả về null
        }

        // Nếu tìm thấy người dùng, trả về người dùng
        return user;
    } catch (error) {
        // Xử lý lỗi khi không thể tìm kiếm
        throw new Error("Failed to find your username!");
    }
};

const isUniqueUsername = async (username) => {
    try {
        const user = await usernameExists(username);

        if (user) {
            throw new Error("The username already exists!");
        }
        return;
    } catch (error) {
        throw new Error("An error has occurred while validating your username, please try again later!");
    }
}

const validateRegisterData = (user) => {
    let err;

    if (
        (err = validatefirstname(user.firstname)) ||
        (err = validatelastname(user.lastname)) ||
        (err = validateEmail(user.email)) ||
        (err = validateUsername(user.username)) ||
        (err = validatePassword(user.password))
    ) {
        return err;
    }

    if (user.password !== user.confirmpassword) {
        return new Error("The password confirmation doesn't match the password provided!");
    }

    return null;
}

const validateUniqueFields = async (email, username) => {
    try {
        await isUniqueEmail(email);

        await isUniqueUsername(username);

        return;
    } catch (error) {
        throw new Error("An error has occurred while validating your email and username, please try again later!");
    }
}

const validateLocation = (lang, lat, country, city) => {
    if (!lang || !lat || !country || !city) {
        return new Error("Something is missing in location information!");
    }

    if (!isLongitude(parseFloat(lang))) {
        return new Error("The Longitude is not valid!");
    }

    if (!isLatitude(parseFloat(lat))) {
        return new Error("The Latitude is not valid!");
    }

    return null;
}

const isUserProfileCompleted = async (user) => {
    try {
        if (!user.gender || !user.looking || !user.birthday || !user.bio || !user.lang || !user.lat || !user.country || !user.city) {
            return false;
        }

        const tags = await db.tags.findUserTags(user.id);
        const tagsArr = JSON.parse(tags);

        if (!tagsArr.length) {
            return false;
        }

        const profileImage = await db.images.findProfileImage(user.id);

        return profileImage ? true : false;
    } catch (error) {
        throw new Error("An error has occurred while validating account information, please try again later!");
    }
}

const validateUserImages = async (profile, gallery) => {
    try {
        if (!profile || !Array.isArray(profile) || !profile.length) {
            throw new Error("The profile picture is required!");
        }

        await fileSizeFilter(profile, gallery);
    } catch (error) {
        throw new Error(error.message || "An error has occurred while validating pictures, please try again later!");
    }
}

const validateTags = async (tags) => {
    try {
        if (!tags || !tags.length) {
            throw new Error("Must have at least one tag!");
        }

        const tagArray = Array.isArray(tags) ? tags : tags.split(',');

        if (tagArray.length > 5) {
            throw new Error("Tags are limited to 5 tags!");
        }

        for (const tag of tagArray) {
            const error = validateTag(tag);
            if (error) throw error;
        }
    } catch (error) {
        throw new Error(error.message || "An error has occurred while validating tags, please try again later!");
    }
}

const validateInformations = async (gender, looking, bio, tags, birthday) => {
    try {
        if (!gender || !looking || !bio || !tags || !birthday) {
            throw new Error("Something is missing in your information!");
        }

        const error =
            validateGender(gender) ||
            validateLooking(looking) ||
            validateBio(bio) ||
            validateBirthday(birthday) ||
            validateAge(birthday);

        if (error) {
            throw error;
        }

        await validateTags(tags);
    } catch (error) {
        throw new Error(error.message || "An error has occurred while validating your information, please try again later!");
    }
}

const completeInfosValidation = async (infos, profile, gallery) => {
    try {
        const locationError = validateLocation(infos.lang, infos.lat, infos.country, infos.city);
        if (locationError) {
            throw locationError;
        }

        await validateUserImages(profile, gallery);

        await validateInformations(infos.gender, infos.looking, infos.bio, infos.tags, infos.birthday);

        return;
    } catch (error) {
        throw new Error(error.message || "An error has occurred while validating complete information, please try again later!");
    }
}

const isNewUsernameExists = async (id, username) => {
    try {
        const user = await db.users.findNewUsername(id, username);
        return user;
    } catch (error) {

        throw new Error("Failed to validate new username!");
    }
}

const isNewEmailExists = async (id, email) => {
    try {
        const user = await db.users.findNewEmail(id, email);
        return user;
    } catch (error) {
        throw new Error("Failed to validate new email!");
    }
}

const validateNewUsername = async (id, username) => {
    try {
        if (username) {
            const user = await isNewUsernameExists(id, username);

            if (user) {
                throw new Error("The new username already exists!");
            }
        }
    } catch (error) {
        throw new Error(error.message || "An error has occurred while validating the new username, please try again later!");
    }
}

const validateNewEmail = async (id, email) => {
    try {
        if (email) {
            const user = await isNewEmailExists(id, email);

            if (user) {
                throw new Error("The new email already exists!");
            }
        }
    } catch (error) {
        throw new Error(error.message || "An error has occurred while validating the new email, please try again later!");
    }
}

const validateEditedUniqueFields = async (id, username, email) => {
    try {
        await validateNewUsername(id, username);
        await validateNewEmail(id, email);
    } catch (error) {
        throw new Error(error.message || "An error has occurred while validating the edited unique fields, please try again later!");
    }
}

const validateEditedInformations = async (id, firstname, lastname, username, email, gender, looking, birthday, tags, bio) => {
    try {
        let error;

        if (
            (firstname && (error = validatefirstname(firstname))) ||
            (lastname && (error = validatelastname(lastname))) ||
            (gender && (error = validateGender(gender))) ||
            (looking && (error = validateLooking(looking))) ||
            (birthday && (error = validateBirthday(birthday))) ||
            (bio && (error = validateBio(bio)))
        ) {
            throw error;
        }

        await validateEditedUniqueFields(id, username, email);

        await validateTags(tags);
    } catch (error) {
        throw new Error(error.message || "An error has occurred while validating the edited information, please try again later!");
    }
}

const isOldpassValid = async (userid, oldpassword) => {
    try {
        const user = await db.users.findOne({ where: { id: userid } });

        if (!user || !(await compare(oldpassword, user.password))) {
            throw new Error("The old password is incorrect!");
        }

        return;
    } catch (error) {
        throw new Error(error.message || "An error has occurred while validating the old password, please try again later!");
    }
}



module.exports = {
    validatefirstname,
    validatelastname,
    validateUsername,
    validateEmail,
    validatePassword,
    validateGender,
    validateBirthday,
    validateAge,
    validateLooking,
    validateBio,
    isLatitude,
    isLongitude,
    emailExists,
    isUniqueEmail,
    usernameExists,
    isUniqueUsername,
    validateRegisterData,
    validateUniqueFields,
    validateLocation,
    isUserProfileCompleted,
    validateUserImages,
    validateTags,
    validateInformations,
    completeInfosValidation,
    isNewUsernameExists,
    isNewEmailExists,
    validateNewUsername,
    validateNewEmail,
    validateEditedUniqueFields,
    validateEditedInformations,
    isOldpassValid
}