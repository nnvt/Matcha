import db from '../models/index';

exports.deletePic = async (req, res, next) => {
    const { userid } = req.body;
    const imgid = req.params.id;

    try {
        const found = await db.images.findOne(imgid, userid);
        if (!found) {
            return res.status(400).json({ success: false, error: "The image specified is not found!" });
        }

        req.body.url = found.url;
        next();
    } catch (error) {
        return res.status(500).json({ success: false, error: "An error occurred while deleting the user's picture. Please try again later." });
    }
}