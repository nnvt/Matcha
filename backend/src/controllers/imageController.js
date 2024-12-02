import db from '../models/index.js';
const { fileFilter, deleteImage } = require("../validators/image.validators");
const { msgsMulterError } = require("../helpers/helpers");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const TYPE_IMAGE = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};
const MAX_SIZE_PICTURE_GALLERY = 5 * 1024 * 1024;
const MAX_SIZE_PICTURE_PROFILE = 370 * 300;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/users");
    },
    filename: async (req, file, cb) => {
        try {
            // Decode JWT and extract user information
            let decoded = jwt.verify(
                req.headers.authorization.split(" ")[1],
                process.env.JWT_PKEY
            );

            // Find user by decoded ID
            const user = await db.users.findOne({ where: { id: decoded.id } });
            if (user) {
                // Construct unique filename
                cb(null, file.fieldname + "-" + user.username + "-" + Date.now() + "." + TYPE_IMAGE[file.mimetype]);
            } else {
                cb(new Error("User not found"), null);
            }
        } catch (err) {
            cb(new Error("Failed to authenticate user"));
        }
    },
});

const uploadProfile = multer({
    storage: storage,
    limits: { fileSize: MAX_SIZE_PICTURE_PROFILE },
    fileFilter: fileFilter,
}).single("profile");

const uploadPicture = multer({
    storage: storage,
    limits: { fileSize: MAX_SIZE_PICTURE_GALLERY },
    fileFilter: fileFilter,
}).single("picture");

// PUT - Upload a profile picture by a connected user
exports.uploadProfilePic = async (req, res) => {
    const { userid } = req.body;
    let errMsg;

    try {
        // Find and delete the existing profile picture if exists
        const profile = await db.images.findOne({ where: { user_id: userid, profile: 1 } });

        if (profile) {
            deleteImage(profile); // Remove image from server
            await db.images.destroy({ where: { id: profile.id, user_id: userid } }); // Delete from DB
        }

        // Upload new profile picture
        uploadProfile(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    success: false,
                    error: msgsMulterError(err.code).message,
                });
            } else if (err) {
                return res.status(400).json({
                    success: false,
                    error: "Failed to upload your profile picture!",
                });
            }

            const profileFile = req.file;
            if (!profileFile) {
                return res.status(400).json({
                    success: false,
                    message: "No profile picture has been specified!",
                });
            }

            // Save the new profile picture to the database
            const newProfilePic = await db.images.create({
                url: profileFile.path,
                profile: 1, // Mark this as the profile picture
                user_id: userid,
            });

            return res.status(200).json({
                success: true,
                message: "Your profile picture has been uploaded successfully!",
                data: newProfilePic,
            });
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while uploading your profile picture, try later!",
        });
    }
};

// POST - Upload a new picture
exports.uploadPic = async (req, res) => {
    const { userid } = req.body;

    try {
        uploadPicture(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    success: false,
                    error: msgsMulterError(err.code).message,
                });
            } else if (err) {
                return res.status(400).json({
                    success: false,
                    error: "Failed to upload your picture!",
                });
            }

            const picture = req.file;
            if (!picture) {
                return res.status(400).json({
                    success: false,
                    message: "No picture has been specified!",
                });
            }

            try {
                // Save the new picture to the database
                const newPicture = await db.images.create({
                    url: picture.path,
                    profile: 0, // Set profile to 0 for gallery images
                    user_id: userid,
                });

                return res.status(200).json({
                    success: true,
                    message: "Your picture has been uploaded successfully!",
                    data: newPicture,
                });
            } catch (e) {
                return res.status(400).json({
                    success: false,
                    error: "An error occurred while saving your picture to the database.",
                });
            }
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while uploading your picture!",
        });
    }
};

// DELETE - Delete a picture by owner
exports.deletePic = async (req, res) => {
    const { userid, url } = req.body;
    const imgid = req.params.id;

    try {
        // Delete the image from server storage
        await deleteImage(url);

        // Delete the image record from the database
        await db.images.destroy({
            where: { id: imgid, user_id: userid, profile: 0 },
        });

        return res.status(200).json({
            success: true,
            message: "Your picture has been deleted!",
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while deleting your picture, try later!",
        });
    }
};