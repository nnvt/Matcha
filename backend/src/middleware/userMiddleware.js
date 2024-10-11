// import db from '../models/index';
// const {
// 	validateRegisterData,
// 	validateUniqueFields,
// 	isUniqueEmail,
// 	emailExists,
// 	isUserProfileCompleted,
// 	validatePassword,
// 	validateEditedInformations,
// 	isOldpassValid,
// 	validateLocation
// } = require("../utils/userValidator");
// const { compare } = require("../utils/genToken");
// const { filterbody, getPayloadGoogleAccount  } = require("../utils/helpers");
// // const { user } = require("../../config/dbconfig");

// exports.register = async ( req, res, next ) => {
// 	let error;
	
// 	try {
// 		const body = req.body = { firstname, lastname, email, username, password, confirmpassword } = await filterbody( req.body );
		
// 		if ( !body.firstname || !body.lastname || !body.email || !body.username || !body.password || !body.confirmpassword ) {
// 			return res.status( 400 ).json({ success: false, error: "Invalid data provided !" });
// 		} else if ( error = validateRegisterData( body ) ) {
// 			return res.status( 400 ).json({ success: false, error: error.message });
// 		} else {
// 			await validateUniqueFields( body.email, body.username )
// 			.then(() => { next(); })
// 			.catch((error) => res.status( 400 ).json({ success: false, error: error.message }) );
// 		}
// 	} catch ( e ) {
// 		return res.status( 400 ).json({ success: false, error: "An error has occurred while validate account informations, try later !" });
// 	}
// }