import db from '../models/index';

exports.visitsHistory = async (req, res) => {
    const userid = req.body.userid;

    try {
        // Fetch visits history using the getVisitsHistory method
        const users = await db.history.getVisitsHistory(userid);

        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'No visit history found for this user.' });
        }

        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: 'An error occurred while loading visits history, try again later!' });
    }
};

exports.loadViewers = async (req, res) => {
    const userid = req.body.userid;

    try {
        // Fetch the viewers using the getUserViewers method
        const users = await db.history.getUserViewers(userid);

        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'No viewers found for this user.' });
        }

        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: "An error has occurred while loading the viewers list, try later!" });
    }
};

exports.loadFollowers = async (req, res) => {
    const userid = req.params.id;

    try {
        // Fetch the followers using the getUserFollowers method
        const users = await db.history.getUserFollowers(userid);

        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'No followers found for this user.' });
        }

        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: "An error has occurred while loading the followers list, try later!" });
    }
};

exports.loadFollowing = async (req, res) => {
    const userid = req.params.id;

    try {
        // Fetch the following users using the getUserFollowing method
        const users = await db.history.getUserFollowing(userid);

        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'No following users found for this user.' });
        }

        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: "An error has occurred while loading the following list, try later!" });
    }
};