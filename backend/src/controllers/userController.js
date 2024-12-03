import db from '../models/index';
const { fileFilter } = require("../utils/imageValidator");
const {
    completeInfosValidation,
    isUserProfileCompleted,
} = require("../utils/userValidator");
const { tagExists, tagUserExists } = require("../utils/tagValidator");
const mailFuncs = require("../utils/mail");
const {
    generatePasswordToken,
    generateToken,
} = require("../utils/genToken");
const {
    filterbody,
    getAge,
    getRangeAge,
    getRangeDistance,
    getRangeFame,
} = require("../utils/helpers");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const usernameGenerator = require("username-generator");
const _ = require("lodash");

// Register a new user
exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, username, password } = req.body;
        const hashPassword = generatePasswordToken(password);
        const token = generateToken(email + new Date().toString());
        const aToken = encodeURIComponent(token);

        // Create new user using Sequelize
        const newUser = await db.users.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            username: username,
            password: hashPassword,
            aToken: aToken,
        });

        // Send confirmation email (using external mail function)
        await mailFuncs.sendConfirmationMail({
            token: aToken,
            email: newUser.email,
            username: newUser.username,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
        });

        return res.status(201).json({ success: true, message: "Successful registration!" });
    } catch (e) {
        return res.status(400).json({ success: false, error: "An error occurred while creating your account, try later !" });
    }
};

// Register with Google account
exports.registerGoogle = async (req, res) => {
    const { tokenid, googleid, payload } = req.body;

    try {
        const newUser = await db.users.create({
            firstname: payload.given_name,
            lastname: payload.family_name,
            email: payload.email,
            username: usernameGenerator.generateUsername("-", 15),
            password: generatePasswordToken(payload.email + tokenid),
            verified: 1,
            googleid: googleid,
        });

        return res.status(201).json({ success: true, message: "Successful registration with Google!" });
    } catch (e) {
        return res.status(400).json({ success: false, error: "An error occurred while registering with your Google account, try later!" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const token = generateToken(email + new Date().toString());
        const resetToken = encodeURIComponent(token);

        // Sử dụng Sequelize để cập nhật reset token vào cơ sở dữ liệu
        const userUpdated = await db.users.update(
            { rToken: resetToken },
            { where: { email: email } }
        );

        if (userUpdated[0] === 0) {
            return res.status(400).json({ success: false, error: "No user found with this email address!" });
        }

        // Gửi email với token reset password
        await mailFuncs.sendRecoveryMail({
            token: resetToken,
            email: email,
        });

        return res.status(200).json({
            success: true,
            message: "A reset password link sent to your email!",
        });
    } catch (e) {
        return res.status(400).json({ success: false, error: "An error has occurred while resetting your password, try later!" });
    }
};

exports.verify = async (req, res) => {
    const { token, email } = req.body;

    try {
        // Sử dụng Sequelize để cập nhật trạng thái xác thực của tài khoản
        const [updatedRowsCount] = await db.users.update(
            { aToken: null, verified: true },
            { where: { email: email.toLowerCase() } }
        );

        if (updatedRowsCount === 0) {
            return res.status(400).json({ success: false, error: "Failed to verify your account!" });
        }

        // Gửi email xác nhận thành công
        const user = await db.users.findOne({ where: { email: email.toLowerCase() } });

        if (!user) {
            return res.status(400).json({ success: false, error: "User not found!" });
        }

        await mailFuncs.sendSuccessActivationMail({
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
        });

        return res.status(200).json({
            success: true,
            message: "Your account has been successfully activated!",
        });
    } catch (e) {
        return res.status(400).json({ success: false, error: "An error has occurred while activating your account, try later!" });
    }
};

exports.newPassword = async (req, res) => {
    try {
        const { token, newpassword } = req.body;
        const hashPassword = generatePasswordToken(newpassword);

        // Sử dụng Sequelize để cập nhật password và xóa reset token
        const [updatedRowsCount] = await db.users.update(
            { password: hashPassword, rToken: null },
            { where: { rToken: token } }
        );

        if (updatedRowsCount === 0) {
            return res.status(400).json({
                success: false,
                error: "Invalid reset token or token has expired.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Your password has been changed!",
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while changing your password, try later!",
        });
    }
};

exports.login = async (req, res) => {
    const { id, isInfosCompleted } = req.body;

    try {
        // Sử dụng Sequelize để tìm người dùng theo id
        const user = await db.users.findOne({ where: { id: id } });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User not found!",
            });
        }

        // Tạo JWT token
        jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_PKEY,
            (err, token) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        error: "Failed to login!",
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        message: "You have been logged in successfully!",
                        token: token,
                        isInfosComplete: isInfosCompleted,
                    });
                }
            }
        );
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while logging in, try later!",
        });
    }
};

exports.logout = (req, res) => {
    try {
        // Thực tế logout chỉ cần xóa JWT token client-side.
        // Không cần thay đổi gì trong cơ sở dữ liệu nếu bạn không cần lưu log đăng xuất.

        // Trả về thông báo thành công
        return res.status(200).json({
            success: true,
            message: "You have been logged out successfully!",
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while logging out, try later!",
        });
    }
};

exports.authGoogle = async (req, res) => {
    const { tokenid, googleid, isInfosCompleted } = req.body;

    try {
        // Sử dụng Sequelize để tìm người dùng có googleid
        const user = await db.users.findOne({ where: { googleid: googleid } });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "Google account not found, please register first!",
            });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_PKEY
        );

        return res.status(200).json({
            success: true,
            message: "You have been logged in successfully!",
            isInfosComplete: isInfosCompleted,
            token: token,
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while logging in with your Google account, try later!",
        });
    }
};

exports.browsing = async (req, res) => {
    const userid = req.body.userid;
    const options = {
        age: {
            min: req.query.minage >= 18 && req.query.minage <= 60 ? req.query.minage : 18,
            max: req.query.maxage >= 18 && req.query.maxage <= 60 ? req.query.maxage : 60,
        },
        distance: {
            min: req.query.mind >= 0 && req.query.mind <= 1000 ? req.query.mind : 0,
            max: req.query.maxd >= 0 && req.query.maxd <= 1000 ? req.query.maxd : 1000,
        },
        fame: {
            min: req.query.minfame >= 0 && req.query.minfame <= 100 ? req.query.minfame : 0,
            max: req.query.maxfame >= 0 && req.query.maxfame <= 100 ? req.query.maxfame : 100,
        },
    };

    try {
        // Sử dụng Sequelize để tìm người dùng với userid
        const user = await db.users.findOne({ where: { id: userid } });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User not found!",
            });
        }

        // Giả sử bạn có một phương thức `findSuggestions` trong model `User`
        const users = await user.findSuggestions(options);

        return res.status(200).json({
            success: true,
            users: users,
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while loading suggestions list, try later!",
        });
    }
};

exports.findUserById = async (req, res) => {
    const id = req.params.id;
    const userid = req.body.userid;

    try {
        // Tìm người dùng theo ID trong Sequelize
        const user = await db.users.findOne({
            where: { id: id }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User not found!",
            });
        }

        return res.status(200).json(user);
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while loading information about the specified user, try later!",
        });
    }
};

exports.findUserByUsername = async (req, res) => {
    const username = req.params.username;
    const userid = req.body.userid;

    try {
        // Tìm người dùng theo username trong Sequelize
        const user = await db.users.findOne({
            where: { username: username }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User not found!",
            });
        }

        return res.status(200).json(user);
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while loading information about the specified user, try later!",
        });
    }
};

exports.profileInfos = async (req, res) => {
    const userid = req.body.userid;

    try {
        // Tìm thông tin profile người dùng trong Sequelize
        const user = await db.users.findOne({
            where: { id: userid }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "Profile not found!",
            });
        }

        return res.status(200).json(user);
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while loading profile information, try later!",
        });
    }
};

exports.verifyToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ valide: false, error: "Token is required" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_PKEY);
        const user = await db.users.findOne({ where: { id: payload.id } });

        if (!user) {
            return res.status(400).json({ valide: false, error: "User not found" });
        }

        return res.status(200).json({ valide: true });
    } catch (error) {
        return res.status(401).json({ valide: false, error: "Invalid token" });
    }
};

// Improved search function with Sequelize
const getOptions = (search, filter) => {
    return {
        search: {
            age: getRangeAge(search.minage, search.maxage),
            fame: getRangeFame(search.minfame, search.maxfame),
        },
        filter: {
            age: getRangeAge(filter.minage, filter.maxage),
            fame: getRangeFame(filter.minfame, filter.maxfame),
            distance: getRangeDistance(filter.mind, filter.maxd),
        },
    };
};

exports.search = async (req, res) => {
    const { userid } = req.body;
    if (!userid) {
        return res.status(400).json({ success: false, error: "User ID is required" });
    }

    const options = getOptions(req.body, req.query);

    try {
        const user = await db.users.findOne({ where: { id: userid } });

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const users = await db.users.findAll({
            where: {
                id: {
                    [db.Sequelize.Op.ne]: userid, // To exclude the current user
                },
                // Add more filters based on options like age, fame, etc.
            },
        });

        return res.status(200).json({ success: true, users });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "An error occurred while searching, try later !",
        });
    }
};

// Improved isinfoscompleted function with Sequelize
exports.isinfoscompleted = async (req, res) => {
    const { userid } = req.body;

    try {
        // Find user by id
        const user = await db.users.findOne({ where: { id: userid } });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found!",
            });
        }

        // Check if user profile is completed
        const isCompleted = await isUserProfileCompleted(user);

        return res.status(200).json({
            success: true,
            complete: isCompleted,
            userid: user.id,
            username: user.username,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: "An error occurred while loading profile information, try later!",
        });
    }
};

const TYPE_IMAGE = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};

const MAX_SIZE_PICTURE_GALLERY = 5 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/users");
    },
    filename: async (req, file, cb) => {
        try {
            // Extract token from the Authorization header
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_PKEY);

            // Find user by ID using Sequelize
            const user = await db.users.findOne({ where: { id: decoded.id } });

            if (!user) {
                return cb(new Error("User not found"));
            }

            // Generate filename
            const filename = `${file.fieldname}-${user.username}-${Date.now()}.${TYPE_IMAGE[file.mimetype]}`;
            cb(null, filename);
        } catch (error) {
            cb(error);
        }
    },
});

const uploadPictures = multer({
    storage: storage,
    limits: { fileSize: MAX_SIZE_PICTURE_GALLERY },
    fileFilter: fileFilter,
}).fields([
    { name: "profile", maxCount: 1 },
    { name: "gallery", maxCount: 4 },
]);

const savePictures = async (userid, profile, gallery) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Insert profile image if exists
            if (
                typeof profile !== "undefined" &&
                Array.isArray(profile) &&
                profile.length !== 0
            ) {
                await db.images.create({
                    url: profile[0].path,
                    profile: 1,
                    user_id: userid,
                })
                    .then(() => { })
                    .catch((error) => {
                        reject(new Error("Failed to save your profile picture !"));
                    });
            }

            // Insert gallery images if exists
            if (
                typeof gallery !== "undefined" &&
                Array.isArray(gallery) &&
                gallery.length !== 0
            ) {
                for (let pic of gallery) {
                    await db.images.create({
                        url: pic.path,
                        profile: 0,
                        user_id: userid,
                    })
                        .then(() => { })
                        .catch((error) => {
                            reject(new Error("Failed to save your gallery picture !"));
                        });
                }
            }

            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

const deleteUserImages = async (userid, profile = null, gallery = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Xóa hình ảnh trong cơ sở dữ liệu
            if (profile) {
                await db.images.destroy({ where: { user_id: userid, profile: 1 } });
                if (fs.existsSync(profile[0].path)) {
                    fs.rmSync(profile[0].path);
                }
            }
            if (gallery) {
                await db.images.destroy({ where: { user_id: userid, profile: 0 } });
                for (let pic of gallery) {
                    if (fs.existsSync(pic.path)) {
                        fs.rmSync(pic.path);
                    }
                }
            }
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

const saveUserTag = async (userid, tagid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tagExists = await db.users_tags.findOne({ where: { user_id: userid, tag_id: tagid } });
            if (!tagExists) {
                await db.tagUsers.create({ user_id: userid, tag_id: tagid })
                    .then(() => resolve())
                    .catch((error) => reject(error));
            } else {
                resolve();
            }
        } catch (e) {
            reject(e);
        }
    });
};

const deleteUserTags = async (userid) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.users_tags.destroy({ where: { user_id: userid } })
                .then(() => resolve())
                .catch((error) => reject(error));
        } catch (e) {
            reject(e);
        }
    });
};

const saveTags = async (userid, tags) => {
    return new Promise(async (resolve, reject) => {
        try {
            let ATags = Array.isArray(tags) ? tags : tags.split(",");

            for (let tagname of ATags) {
                const tag = await db.tags.findOne({ where: { name: tagname.toLowerCase().trim() } });
                if (!tag) {
                    // Save new Tag
                    await db.tags.create({ name: tagname.toLowerCase().trim() })
                        .then(async (newTag) => {
                            await saveUserTag(userid, newTag.id);
                        })
                        .catch((error) => reject(new Error("Failed to save a new tag !")));
                } else {
                    await saveUserTag(userid, tag.id);
                }
            }
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

exports.setStatus = async (req, res) => {
    const { userid } = req.body;

    try {
        // Cập nhật trạng thái của người dùng
        await db.users.update(
            { status: 'new status' }, // Thay 'new status' bằng giá trị thực tế bạn muốn thay
            { where: { id: userid } }
        );

        return res.status(200).json({ success: true });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while changing status, try later!",
        });
    }
};

exports.getStatus = async (req, res) => {
    const id = req.params.id;

    try {
        // Tìm người dùng theo id và lấy trạng thái
        const user = await db.users.findOne({
            where: { id: id },
            attributes: ['status'], // Chỉ lấy trường status
        });

        if (user) {
            return res.status(200).json({ success: true, data: user.status });
        } else {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while retrieving the status, try later!",
        });
    }
};

// PATCH - Complete profile informations
exports.completeInfos = async (req, res) => {
    let errMsg;
    const userid = req.body.userid;

    try {
        // Xóa tags và hình ảnh của người dùng
        await deleteUserTags(userid);
        await deleteUserImages(userid);

        // Upload hình ảnh
        uploadPictures(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                switch (err.code) {
                    case "LIMIT_FILE_SIZE":
                        errMsg = "The file must be less than 2MB !";
                        break;
                    case "LIMIT_UNEXPECTED_FILE":
                        errMsg = "Unexpected fields to get files from !";
                        break;
                    default:
                        errMsg = "An error has occurred while validating uploaded files !";
                        break;
                }
                return res.status(400).json({ success: false, error: errMsg });
            } else if (err) {
                return res.status(400).json({ success: false, error: err });
            } else {
                try {
                    const profile = req.files.profile;
                    const gallery = req.files.gallery;
                    const body = req.body;

                    // Validate thông tin người dùng
                    await completeInfosValidation(body, profile, gallery)
                        .then(async () => {
                            // Lưu tags cho người dùng
                            await saveTags(userid, body.tags)
                                .then(async () => {
                                    // Lưu ảnh cho người dùng
                                    await savePictures(userid, profile, gallery)
                                        .then(async () => {
                                            // Cập nhật thông tin người dùng
                                            await db.users.update(
                                                {
                                                    gender: body.gender.toLowerCase(),
                                                    looking: body.looking.toLowerCase(),
                                                    bio: body.bio.toLowerCase(),
                                                    birthday: new Date(body.birthday),
                                                    age: getAge(new Date(body.birthday)),
                                                    lat: body.lat,
                                                    lang: body.lang,
                                                    country: body.country.toLowerCase(),
                                                    city: body.city.toLowerCase(),
                                                },
                                                { where: { id: userid } }
                                            ).then(() =>
                                                res.status(200).json({
                                                    success: true,
                                                    message: "Your information has been completed successfully !",
                                                })
                                            );
                                        });
                                });
                        })
                        .catch(async (error) => {
                            await deleteUserTags(userid);
                            await deleteUserImages(profile, gallery);
                            return res.status(400).json({
                                success: false,
                                error: error.message,
                            });
                        });
                } catch (e) {
                    await deleteUserTags(userid);
                    await deleteUserImages(profile, gallery);
                    return res.status(400).json({
                        success: false,
                        error: "Failed to complete your information !",
                    });
                }
            }
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while completing your information, try later !",
        });
    }
};

exports.editInfos = async (req, res) => {
    const {
        userid,
        firstname,
        lastname,
        username,
        email,
        gender,
        looking,
        bio,
        birthday,
        tags,
    } = await filterbody(req.body);

    try {
        const user = await db.users.findOne({ where: { id: userid } });

        // Edit user tags
        await editUserTags(userid, tags || user.tags);

        // Edit user information
        await db.users.findOneAndUpdate(
            { id: userid },
            {
                firstname: firstname || user.firstname,
                lastname: lastname || user.lastname,
                username: username || user.username,
                email: email || user.email,
                gender: gender || user.gender,
                looking: looking || user.looking,
                bio: bio || user.bio,
                birthday: birthday || user.birthday,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Your informations have been updated successfully !",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message || "An error has occurred while editing information, try later !",
        });
    }
};

exports.changepassword = async (req, res) => {
    const { userid, newpassword } = req.body;

    try {
        const hashNewPassword = generatePasswordToken(newpassword);

        // Cập nhật mật khẩu
        await db.users.findOneAndUpdate({ id: userid }, { password: hashNewPassword });

        return res.status(200).json({
            success: true,
            message: "Your password has been changed successfully !",
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while changing your password, try later !",
        });
    }
};

exports.editLocation = async (req, res) => {
    const { userid, country, city, lat, lang } = req.body;

    try {
        // Cập nhật vị trí
        await fb.users.findOneAndUpdate(
            { id: userid },
            { lat, lag: lang, country, city }
        );

        return res.status(200).json({
            success: true,
            message: "Your location has been updated successfully !",
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while editing your location, try later !",
        });
    }
};

exports.like = async (req, res) => {
    const id = parseInt(req.params.id);
    const { userid, likedBySpecifiedUser } = req.body;

    try {
        // Tạo "thích"
        await db.history.like(userid, id);

        // Nếu người dùng thích lại, tạo kết bạn và phòng chat
        if (likedBySpecifiedUser) {
            await db.matchers.match(userid, id);
            await db.messages.createRoomChat(userid, id);
            await db.notifications.create({ content: "Liked you back !", to: id, from: userid });
        }

        return res.status(200).json({ success: true, message: "Liked successfully !" });
    } catch (e) {
        // Hủy "thích" nếu có lỗi
        await db.history.unlike(userid, id);
        return res.status(400).json({ success: false, error: "Failed to like the specified user !" });
    }
};

exports.unlike = async (req, res) => {
    const id = parseInt(req.params.id);
    const { userid, matched } = req.body;

    try {
        // Bỏ "thích"
        await db.history.unlike(userid, id);

        // Nếu đã kết bạn, hủy kết bạn và xóa phòng chat
        if (matched) {
            await db.matchers.unmatch(userid, id);
            await db.messages.deleteRoomChat(userid, id);
        }

        return res.status(200).json({ success: true, message: "Unliked successfully !" });
    } catch (e) {
        return res.status(400).json({ success: false, error: "An error has occurred while unliking the specified user, try later !" });
    }
};

exports.blacklist = async (req, res) => {
    const { userid } = req.body;

    try {
        // Lấy danh sách đen
        const list = await db.blockers.getBlacklist(userid);

        return res.status(200).json({
            success: true,
            data: JSON.parse(list),
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while loading your blacklist, try later !",
        });
    }
};

exports.block = async (req, res) => {
    const { blocked } = req.params;
    const { userid } = req.body;

    try {
        // Chặn người dùng
        await db.blockers.block(userid, blocked);

        return res.status(200).json({
            success: true,
            message: "Blocked successfully !",
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while blocking the specified user, try later !",
        });
    }
};

exports.unblock = async (req, res) => {
    const { unblocked } = req.params;
    const { userid } = req.body;

    try {
        // Mở khóa người dùng
        await db.blockers.unblock(userid, unblocked);

        return res.status(200).json({
            success: true,
            message: "Unblocked successfully !",
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while unblocking the specified user, try later !",
        });
    }
};

exports.report = async (req, res) => {
    const { id } = req.params;

    try {
        // Báo cáo người dùng
        await db.users.report(id);

        return res.status(200).json({
            success: true,
            message: "Reported successfully !",
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while reporting the specified user, try later !",
        });
    }
};
