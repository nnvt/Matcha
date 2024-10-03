
const Match = require("../models/matchers.model");

exports.loadMatchers = async (req, res) => {
	const { userid } = req.body;

	try {
		await Match.findMatchers(userid)
			.then((matchers) => res.status(200).json({ success: true, users: matchers }))
			.catch((error) => res.status(200).json({ success: false, error: "Failed to load matchers list !" }));
	} catch (e) {
		return res.status(400).json({ success: false, error: "An error has occurred while load matchers list, try later !" });
	}
}


exports.findMatch = async (req, res) => {
	const { matcher, matched } = req.body;

	try {
		await Match.findMatch(matcher, matched)
			.then((match) => {
				if (match) {
					res.status(200).json({ success: true, match });
				} else {
					res.status(404).json({ success: false, message: "No match found." });
				}
			})
			.catch((error) =>
				res.status(400).json({ success: false, error: "Failed to find match." })
			);
	} catch (e) {
		return res
			.status(400)
			.json({ success: false, error: "An error occurred while finding match." });
	}
};

// Controller function to create a match between two users
exports.createMatch = async (req, res) => {
	const { matcher, matched } = req.body;

	try {
		await Match.match(matcher, matched)
			.then(() => res.status(201).json({ success: true, message: "Matched successfully!" }))
			.catch((error) =>
				res.status(400).json({ success: false, error: "Failed to create match." })
			);
	} catch (e) {
		return res
			.status(400)
			.json({ success: false, error: "An error occurred while creating match." });
	}
};

// Controller function to delete a match between two users
exports.unmatch = async (req, res) => {
	const { matcher, matched } = req.body;

	try {
		await Match.unmatch(matcher, matched)
			.then(() => res.status(200).json({ success: true, message: "Unmatched successfully!" }))
			.catch((error) =>
				res.status(400).json({ success: false, error: "Failed to unmatch." })
			);
	} catch (e) {
		return res
			.status(400)
			.json({ success: false, error: "An error occurred while unmatching." });
	}
};
