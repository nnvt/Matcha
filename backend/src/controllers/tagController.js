import db from '../models/index.js';

exports.tagsList = async (req, res) => {
    try {
        // Fetch all tags using Sequelize
        const tags = await db.tags.findAll();

        return res.status(200).json({
            success: true,
            data: tags, // Return the tags data
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "An error has occurred while loading the tags list, try later!",
        });
    }
};