import db from '../models/index';
const {
	validateRegisterData,
	validateUniqueFields,
	isUniqueEmail,
	emailExists,
	isUserProfileCompleted,
	validatePassword,
	validateEditedInformations,
	isOldpassValid,
	validateLocation
} = require("../utils/userValidator");
const { compare } = require("../utils/genToken");
const { filterbody, getPayloadGoogleAccount } = require("../utils/helpers");
// const { user } = require("../../config/dbconfig");

const register = async (req, res, next) => {
	let error;

	try {
		const body = req.body = { firstname, lastname, email, username, password, confirmpassword } = await filterbody(req.body);

		if (!body.firstname || !body.lastname || !body.email || !body.username || !body.password || !body.confirmpassword) {
			return res.status(400).json({ success: false, error: "Invalid data provided !" });
		} else if (error = validateRegisterData(body)) {
			return res.status(400).json({ success: false, error: error.message });
		} else {
			await validateUniqueFields(body.email, body.username)
				.then(() => { next(); })
				.catch((error) => res.status(400).json({ success: false, error: error.message }));
		}
	} catch (e) {
		return res.status(400).json({ success: false, error: "An error has occurred while validate account informations, try later !" });
	}
}

const registerGoogle = async (req, res, next) => {
	const { tokenid, googleid } = req.body;

	try {
		if (!tokenid || !googleid) {
			return res.status(400).json({ success: false, error: "Invalid data provided!" });
		}

		const payload = await getPayloadGoogleAccount(tokenid);

		await isUniqueEmail(payload.email);

		const user = await db.users.findOne({ googleid: googleid });

		if (user) {
			return res.status(400).json({ success: false, error: "The account already exists!" });
		} else {
			req.body.payload = payload;
			next();
		}
	} catch (error) {
		return res.status(400).json({ success: false, error: error.message || "An error has occurred while validating Google account, try later!" });
	}
}
const verify = async (req, res, next) => {
	const { token } = req.body;

	try {
		if (!token) {
			return res.status(400).json({ success: false, error: "No token activation found!" });
		}

		const user = await db.users.findOne({ aToken: token });

		if (!user) {
			return res.status(400).json({ success: false, error: "Activation token is invalid or the account is already activated!" });
		}

		req.body.email = user.email;
		next();
	} catch (error) {
		return res.status(400).json({ success: false, error: "An error has occurred while validating your account, try later!" });
	}
}
const resetPassword = async (req, res, next) => {
	try {
		const { email } = await filterbody(req.body);

		if (!email) {
			return res.status(400).json({ success: false, error: "Email can't be blank!" });
		}

		const user = await emailExists(email);

		if (!user) {
			return res.status(400).json({ success: false, error: "The account doesn't exist!" });
		}

		next();
	} catch (error) {
		return res.status(400).json({ success: false, error: "An error has occurred while validating your email, try later!" });
	}
}
const newPassword = async (req, res, next) => {
	const { token, newpassword, confirmpassword } = req.body;
	let error;

	try {
		if (!token) {
			return res.status(400).json({ success: false, error: "No recovery token found!" });
		}

		if (!newpassword || !confirmpassword) {
			return res.status(400).json({ success: false, error: "Invalid data provided!" });
		}

		const user = await db.users.findOne({ rToken: token });

		if (!user) {
			return res.status(400).json({ success: false, error: "The recovery token is invalid!" });
		}

		if (error = validatePassword(newpassword)) {
			return res.status(400).json({ success: false, error: error.message });
		}

		if (newpassword !== confirmpassword) {
			return res.status(400).json({ success: false, error: "Passwords don't match!" });
		}

		next();

	} catch (error) {
		return res.status(400).json({ success: false, error: "An error occurred while validating passwords, try later!" });
	}
}
const login = async (req, res, next) => {
	const { username, password } = req.body;

	try {
		if (!username || !password) {
			return res.status(400).json({ success: false, error: "Invalid data provided!" });
		}

		const user = await db.users.findOne({ username: username.toLowerCase() });

		if (!user || !(await compare(password, user.password))) {
			return res.status(400).json({ success: false, error: "The username or password is incorrect!" });
		}

		if (!user.verified) {
			return res.status(401).json({ success: false, error: "You must confirm your account first!" });
		}

		const isCompleted = await isUserProfileCompleted(user);

		req.body.id = user.id;
		req.body.isInfosCompleted = isCompleted;

		next();
	} catch (error) {
		return res.status(400).json({ success: false, error: "An error occurred while validating login information, try later!" });
	}
}
const authGoogle = async (req, res, next) => {
	const { tokenid, googleid } = req.body;

	try {
		if (!tokenid || !googleid) {
			return res.status(400).json({ success: false, error: "Invalid data provided!" });
		}

		const user = await db.users.findOne({ googleid: googleid });

		if (!user) {
			return res.status(400).json({ success: false, error: "An account with the specified Google account doesn't exist!" });
		}

		const isCompleted = await isUserProfileCompleted(user);

		req.body.userid = user.id;
		req.body.username = user.username;
		req.body.isInfosCompleted = isCompleted;

		next();

	} catch (error) {
		return res.status(400).json({ success: false, error: "An error occurred while validating your Google account, try later!" });
	}
}
const findUserById = async (req, res, next) => {
	const { id } = req.params;

	try {
		const user = await db.users.findOne({ id: id });

		if (!user) {
			return res.status(404).json({ success: false, error: "The user is not found!" });
		}

		next();
	} catch (error) {
		return res.status(400).json({ success: false, error: "An error occurred while validating the specified user, try later!" });
	}
}
const findUserByUsername = async (req, res, next) => {
	const { username } = req.params;

	try {
		const user = await db.users.findOne({ username: username });

		if (!user) {
			return res.status(404).json({ success: false, error: "The user is not found!" });
		}

		next();
	} catch (error) {
		return res.status(400).json({ success: false, error: "An error occurred while validating the specified user, try later!" });
	}
}
const completeInfos = async (req, res, next) => {
	const { userid } = req.body;

	try {
		const user = await db.users.findOne({ id: userid });

		if (!user) {
			return res.status(400).json({ success: false, error: "An error has occurred while validating account information!" });
		}

		const isCompleted = await isUserProfileCompleted(user);

		if (!isCompleted) {
			return res.status(401).json({ success: false, error: "Must complete your profile information!" });
		}

		next();
	} catch (error) {
		return res.status(400).json({ success: false, error: "An error has occurred while validating account information, try later!" });
	}
}
const isProfileCompleted = async (req, res, next) => {
	const { userid } = req.body;

	try {
		const user = await db.users.findOne({ id: userid });

		if (!user) {
			return res.status(400).json({ success: false, error: "User not found!" });
		}

		const isCompleted = await isUserProfileCompleted(user);

		if (isCompleted) {
			return res.status(400).json({ success: false, error: "Profile information already completed!" });
		}

		next();
	} catch (error) {
		return res.status(400).json({ success: false, error: "An error has occurred while validating account information, try later!" });
	}
}
const editInfos = async (req, res, next) => {
	const { userid, firstname, lastname, username, email, gender, looking, birthday, tags } = req.body;

	try {
		await validateEditedInformations(userid, firstname, lastname, username, email, gender, looking, birthday, tags);

		next();
	} catch (error) {
		return res.status(400).json({ success: false, error: error.message });
	}
}
const changepassword = async (req, res, next) => {
	const { userid, oldpassword, newpassword, confirmpassword } = req.body;

	try {
		if (!oldpassword || !newpassword || !confirmpassword) {
			return res.status(400).json({ success: false, error: "Invalid data provided!" });
		}

		const oldPasswordError = validatePassword(oldpassword);
		if (oldPasswordError) {
			return res.status(400).json({
				success: false,
				error: "The old password must be at least one uppercase letter, one lowercase letter, one number, and one special character (min 8 characters)!"
			});
		}

		const newPasswordError = validatePassword(newpassword);
		if (newPasswordError) {
			return res.status(400).json({
				success: false,
				error: "The new password must be at least one uppercase letter, one lowercase letter, one number, and one special character!"
			});
		}

		if (newpassword !== confirmpassword) {
			return res.status(400).json({ success: false, error: "The passwords don't match!" });
		}

		await isOldpassValid(userid, oldpassword);

		next();
	} catch (error) {
		return res.status(400).json({ success: false, error: "An error has occurred while validating passwords, try later!" });
	}
}
const editLocation = async (req, res, next) => {
	const { country, city, lat, lang } = req.body;

	try {
		const error = validateLocation(lang, lat, country, city);
		if (error) {
			return res.status(400).json({ success: false, error: error.message });
		}

		next();
	} catch (e) {
		return res.status(400).json({ success: false, error: "An error has occurred while validating information, try later!" });
	}
}
const like = async (req, res, next) => {
	const id = parseInt(req.params.id);
	const { userid } = req.body;

	try {
		if (!id) {
			return res.status(400).json({ success: false, error: "Something is missing!" });
		}

		if (userid === id) {
			return res.status(400).json({ success: false, error: "It's your own profile, dude!" });
		}

		const user = await db.users.findOne({ id });
		if (!user) {
			return res.status(404).json({ success: false, error: "The specified user is not found!" });
		}

		const found = await db.images.findProfileImage(userid);
		if (!found) {
			return res.status(400).json({ success: false, error: "Can't complete like action!" });
		}

		const likeExists = await db.history.findLike(userid, id);
		if (likeExists) {
			return res.status(400).json({ success: false, error: "You already like the specified profile!" });
		}

		next();
	} catch (error) {
		return res.status(400).json({ success: false, error: "An error has occurred while validating the specified user to like, try later!" });
	}
}
const likedBack = async (req, res, next) => {
	const id = parseInt(req.params.id);
	const { userid } = req.body;

	try {
		const like = await db.history.findLike(id, userid);
		req.body.likedBySpecifiedUser = !!like;

		next();
	} catch (error) {
		return res.status(400).json({ success: false, error: "An error has occurred while validating the specified user to like, try later!" });
	}
}
const unlike = async (req, res, next) => {
	const id = parseInt(req.params.id);
	const { userid } = req.body;

	try {
		if (!id) {
			return res.status(400).json({ success: false, error: "Something is missing!" });
		}

		if (userid === id) {
			return res.status(400).json({ success: false, error: "It's your own profile, dude!" });
		}

		const user = await User.findOne({ where: { id } });
		if (!user) {
			return res.status(404).json({ success: false, error: "The specified user is not found!" });
		}

		const like = await db.history.findLike(userid, id);
		if (!like) {
			return res.status(400).json({ success: false, error: "You didn't like him yet!" });
		}

		next();
	} catch (error) {
		return res.status(400).json({ success: false, error: "An error has occurred while validating the specified user to unlike, try later!" });
	}
}
const isMatch = async (req, res, next) => {
	const id = parseInt(req.params.id);
	const { userid } = req.body;

	try {

		const match = await db.matchers.findMatch(userid, id);
		req.body.matched = !!match;

		next();
	} catch (error) {
		return res.status(400).json({ success: false, error: "An error has occurred while validating the specified user, try later!" });
	}
}
const block = async (req, res, next) => {
	const { blocked } = req.params;
	const { userid } = req.body;

	try {

		if (!blocked) {
			return res.status(400).json({ success: false, error: "Something is missing!" });
		}


		if (blocked === userid) {
			return res.status(400).json({ success: false, error: "It's your own profile, dude!" });
		}


		const user = await db.users.findOne({ id: blocked });
		if (!user) {
			return res.status(404).json({ success: false, error: "The user specified is not found!" });
		}

		const block = await db.blockers.findBlock(userid, blocked);
		if (block) {
			return res.status(400).json({ success: false, error: "You have already blocked the specified user!" });
		}

		next();
	} catch (error) {
		return res.status(400).json({ success: false, error: "An error has occurred while validating information, try later!" });
	}
}
const unblock = async (req, res, next) => {
	const { unblocked } = req.params;
	const { userid } = req.body;

	try {
		if (!unblocked) {
			return res.status(400).json({ success: false, error: "Something is missing !" });
		} else if (unblocked == userid) {
			return res.status(400).json({ success: false, error: "Its your own profile dude !" });
		} else {
			await User.findOne({ id: unblocked })
				.then(async () => {
					if (!user) {
						return res.status(404).json({ success: false, error: "The user specified is not found !" });
					} else {
						await db.blockers.findBlock(userid, unblocked)
							.then((block) => {
								if (!block) return res.status(400).json({ success: false, error: "You did not block the specified user yet !" });
								else next();
							})
							.catch((error) => res.status(400).json({ success: false, error: "Failed to validate the user to unblock !" }));
					}
				})

		}
	} catch (e) {
		return res.status(400).json({ success: false, error: "An error has occurred while validate informations, try later !" });
	}
}
const report = async (req, res, next) => {
	const { id } = req.params;
	const { userid } = req.body;

	try {
		if (id === userid) {
			return res.status(400).json({ success: false, error: "It's your own profile, dude!" });
		}

		next();
	} catch (error) {
		return res.status(400).json({ success: false, error: "An error has occurred while validating the specified user, try later!" });
	}
}

module.exports = {
	register,
	registerGoogle,
	verify,
	resetPassword,
	newPassword,
	login,
	authGoogle,
	findUserById,
	findUserByUsername,
	completeInfos,
	isProfileCompleted,
	editInfos,
	changepassword,
	editLocation,
	like,
	likedBack,
	unlike,
	isMatch,
	block,
	unblock,
	report
}