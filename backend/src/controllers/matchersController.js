import db from '../models/index';

exports.loadMatchers = async (req, res) => {
    const { userid } = req.body;

    try {
        await db.matchers.findMatchers(userid)
            .then((matchers) => res.status(200).json({ success: true, users: matchers }))
            .catch((error) => res.status(200).json({ success: false, error: "Failed to load matchers list !" }));
    } catch (e) {
        return res.status(400).json({ success: false, error: "An error has occurred while load matchers list, try later !" });
    }
}