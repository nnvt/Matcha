import db from '../models/index';
const Sequelize = require('sequelize')
// Get the blacklist of a specific user
const getBlacklist = async (userId) => {
  try {
    const blacklist = await db.Blocker.findAll({
      attributes: [],
      where: { blocker: userId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.User,
          as: 'BlockedUser', // Alias for the associated user (blocked)
          attributes: [
            'id',
            'username',
            'gender',
            'fame',
            'age',
            'country',
            'city',
            [Sequelize.col('Images.url'), 'profile'] // Get profile image URL from associated images
          ],
          include: [
            {
              model: db.Image,
              as: 'Images',
              where: { profile: 1 },
              attributes: [], // Do not return the entire Image object, only get the `url`
              required: false
            }
          ]
        }
      ]
    });

    return blacklist;
  } catch (e) {
    throw e;
  }
};

// Find a specific block entry between two users
const findBlock = async (blocker, blocked) => {
  try {
    const block = await db.Blocker.findOne({
      where: {
        blocker,
        blocked
      }
    });

    return block || null;
  } catch (e) {
    throw e;
  }
};

// Block a user
const block = async (blocker, blocked) => {
  try {
    const newBlock = await db.Blocker.create({ blocker, blocked });
    return newBlock;
  } catch (e) {
    throw e;
  }
};

// Unblock a user
const unblock = async (blocker, blocked) => {
  try {
    const result = await db.Blocker.destroy({
      where: { blocker, blocked }
    });

    return result;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getBlacklist, findBlock, block, unblock
};
