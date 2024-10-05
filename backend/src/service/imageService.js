import { Model } from 'sequelize';
import db from '../models/index';
const find = async (where) => {
    try {
      const result = await db.Image.findAll({
        where, // Directly pass the 'where' condition to Sequelize
      });
      return JSON.stringify(result); // Return the result as a JSON string
    } catch (error) {
      throw error; // Propagate the error for the caller to handle
    }
  };

const findOne = async (id, uid) => {
	try {
        const res = await db.Image.findOne({
            where: {
                id : id, user_id : uid
            },
        });
        return res ? res : null;
    } catch(error) {
        throw error;
    }
};

const findUserImages = async (userid) => {
    try {
        const res = await db.Image.findAll({  
            include: [
            {
                model: db.User,
                as: 'user',
                where: {id : userid},
                attributes: [],
            },
            ],
        })
        return JSON.stringify(res);
    } catch(error){
        throw error;
    }
}

const findProfileImage = async (userid) => {
    try {
      const res = await db.Image.findOne({
        where: { user_id: userid, profile: 1 }, // Find a single image where user_id matches and profile is 1
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: [],
          },
        ],
      });
      return res; // Return the result or null if not found
    } catch (error) {
      throw error;
    }
  };
  
  
  // Find a specific picture by its URL and user ID, but not the profile picture
  const findPicture = async (userid, url) => {
    try {
      const result = await db.Image.findOne({
        where: { profile: 0, user_id: userid, url }, // 'profile' must be 0
      });
      return result ? result : null;
    } catch (error) {
      throw error;
    }
  };
  
  // Save a new image entry to the database
  const save = async (image) => {
    try {
      const newImage = await db.Image.create(image); // Create a new image record
      if (image.profile) {
        // If the image is a profile picture, return the profile image
        return await findProfileImage(image.user_id);
      } else {
        // Otherwise, return the newly created picture
        return await findPicture(image.user_id, image.url);
      }
    } catch (error) {
      throw error;
    }
  };
  
  // Delete a profile picture by image ID and user ID
  const deleteProfilePicture = async (imgid, userid) => {
    try {
      await db.Image.destroy({
        where: { id: imgid, user_id: userid },
      });
    } catch (error) {
      throw error;
    }
  };
  
  // Delete an image by image ID, user ID, and profile status
  const del = async (userid, imgid, isprofile) => {
    try {
      await db.Image.destroy({
        where: { id: imgid, user_id: userid, profile: isprofile },
      });
    } catch (error) {
      throw error;
    }
  };
  
  module.exports = {
    find,
    findOne,
    findUserImages,
    findProfileImage,
    findPicture,
    save,
    deleteProfilePicture,
    del,
  };