import db from '../models/index';

exports.validateNotif = async (req, res, next) => {
    const id = req.params.id;
    const { userid } = req.body;
    
    try {
        const notif = await db.notification.findnotif(id, userid);
        if (!notif) {
            return res.status(404).json({ success: false, error: "The notification is not found!" });
        }
        next();
    } catch (error) {
        return res.status(400).json({ success: false, error: "An error occurred while validating the notification. Please try again later." });
    }
};