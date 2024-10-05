import db from '../models/index';
import connectDB from '../config/connectDB';
import prepareUserData from '../helpers/helpers';
import user from '../config/dbConfig';

const findOne = async (where) => {
  try {
    const result = await db.users.findOne({
      where: where,
      attributes: [
        'id', 'firstname', 'lastname', 'email', 'username', 'gender', 'looking',
        'birthday', 'age', 'bio', 'lag', 'lat', 'country', 'city', 'verified',
        'password', 'fame', 'status'
      ],
    });

    return result ? result : null;
  } catch (error) {
    throw error;
  }
}

const save = async (user) => {
  try {
    await db.users.create(user);

    const savedUser = await db.users.findOne({
      where: { username: user.username },
    });

    return savedUser;
  } catch (error) {
    throw error;
  }
}

const findOneAndUpdate = async (where, updates) => {
  try {
    const [numberOfAffectedRows] = await db.users.update(updates, {
      where: where,
    });

    if (numberOfAffectedRows === 0) {
      return null;
    }

    const updatedUser = await db.users.findOne({
      where: where,
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
}

const findNewUsername = async (id, username) => {
  try {
    const user = await db.users.findOne({
      where: {
        id: { [db.Sequelize.Op.ne]: id },
        username: username,
      },
    });

    return user ? user : null;
  } catch (error) {
    throw error;
  }
}

const findNewEmail = async (id, email) => {
  try {
    const user = await db.users.findOne({
      where: {
        id: { [db.Sequelize.Op.ne]: id },
        email: email,
      },
    });

    return user ? user : null;
  } catch (error) {
    throw error;
  }
}
const loadProfile = async (userid) => {
  try {
    const userInstance = await db.users.findOne({
      where: { id: userid },
    });

    if (userInstance) {
      const user = userInstance.dataValues;
      delete user.password;
      delete user.verified;

      // Lấy thông tin tags của người dùng
      user.tags = JSON.parse(await db.tags.findUserTags(userid));

      // Lấy số lượng followers, following, views từ bảng `History`
      user.followers = await db.history.getCountFollowers(userid);
      user.following = await db.history.getCountFollowing(userid);
      user.views = await db.history.getCountViews(userid);

      // Lấy tất cả các ảnh của người dùng
      user.images = JSON.parse(await db.images.findUserImages(userid));

      return user;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}
const loadUser = async (where, connuser) => {
  try {
    const userInstance = await db.users.findOne({
      where: where,
    });

    if (userInstance) {
      const user = userInstance.dataValues;

      delete user.password;
      delete user.verified;
      delete user.email;

      user.tags = JSON.parse(await db.tags.findUserTags(user.id));

      user.images = JSON.parse(await db.images.findUserImages(user.id));

      user.followers = await db.history.getCountFollowers(user.id);
      user.following = await db.history.getCountFollowing(user.id);

      user.blocked = await db.blockers.findBlock(connuser, user.id) ? true : false;

      user.liked = await db.history.findLike(connuser, user.id) ? true : false;

      user.matched = await db.matchers.findMatch(connuser, user.id) ? true : false;

      return user;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

const findSuggestions = async (user, options) => {
  try {

    const suggestions = await db.users.findAll({
      attributes: [
        'id', 'firstname', 'lastname', 'username', 'age', 'gender', 'fame', 'country', 'city',

        [
          db.Sequelize.literal(`ROUND(ST_Distance_Sphere(POINT(${user.lat}, ${user.lang}), POINT(users.lat, users.lag)) * 0.001)`),
          'distance'
        ],

        [
          db.Sequelize.literal(`(SELECT COUNT(users_tags.tag_id) FROM users_tags WHERE users_tags.user_id = users.id AND users_tags.tag_id IN (SELECT tag_id FROM users_tags WHERE users_tags.user_id = ${user.id}))`),
          'commonTags'
        ],

        [
          db.Sequelize.literal(`(SELECT url FROM images WHERE images.user_id = users.id AND images.profile = 1 LIMIT 1)`),
          'profile'
        ]
      ],
      where: {
        id: { [db.Sequelize.Op.ne]: user.id },
        gender: user.looking,
        age: { [db.Sequelize.Op.between]: [options.age.min, options.age.max] },
        fame: { [db.Sequelize.Op.between]: [options.fame.min, options.fame.max] }
      },
      include: [
        {
          model: db.users_tags,
          as: 'userTags',
          required: false,
        },
      ],
      having: db.Sequelize.literal(`distance BETWEEN ${options.distance.min} AND ${options.distance.max}`), // Điều kiện khoảng cách
      order: [
        ['distance', 'ASC'],
        ['commonTags', 'DESC'],
        ['fame', 'DESC'],
      ],
      group: ['users.id'],
      raw: true
    });

    const preparedUsers = await prepareUserData(JSON.stringify(suggestions));
    return preparedUsers;
  } catch (error) {
    throw error;
  }
}

const search = async (user, options) => {
  try {

    const users = await db.users.findAll({
      attributes: [
        'id', 'firstname', 'lastname', 'username', 'age', 'gender', 'fame', 'country', 'city',
        [
          db.Sequelize.literal(`ROUND(ST_Distance_Sphere(POINT(${user.lat}, ${user.lang}), POINT(users.lat, users.lag)) * 0.001)`),
          'distance'
        ],

        [
          db.Sequelize.literal(`(
              SELECT COUNT(users_tags.tag_id)
              FROM users_tags
              WHERE users_tags.user_id = users.id
              AND users_tags.tag_id IN (
                SELECT tag_id FROM users_tags WHERE users_tags.user_id = ${user.id}
              )
            )`),
          'commonTags'
        ],

        [
          db.Sequelize.literal(`(SELECT url FROM images WHERE images.user_id = users.id AND images.profile = 1 LIMIT 1)`),
          'profile'
        ]
      ],
      where: {
        id: { [db.Sequelize.Op.ne]: user.id },
        age: { [db.Sequelize.Op.between]: [options.search.age.min, options.search.age.max] },
        fame: { [db.Sequelize.Op.between]: [options.search.fame.min, options.search.fame.max] },
        id: {
          [db.Sequelize.Op.notIn]: db.Sequelize.literal(
            `(SELECT blocked FROM blockers WHERE blocker = ${user.id})`
          ),
        }
      },
      order: [
        ['fame', 'DESC'],
        [db.Sequelize.literal('distance'), 'ASC'],
        [db.Sequelize.literal('commonTags'), 'DESC']
      ],
      raw: true
    });

    const preparedUsers = await prepareUserData(JSON.stringify(users));
    return preparedUsers;
  } catch (error) {
    throw error;
  }
}

const getStatus = async (userid) => {
  try {
    const user = await db.users.findOne({
      where: { id: userid },
      attributes: ['status'],
    });

    return user ? user.status : null;
  } catch (error) {
    throw error;
  }
}

const setStatus = async (userid) => {
  try {
    await db.users.update(
      { status: db.Sequelize.literal('NOW()') },
      { where: { id: userid } }
    );

  } catch (error) {
    throw error;
  }
}

const report = async (reported) => {
  try {
    const result = await db.users.update(
      { reports: db.Sequelize.literal('reports + 1') },
      { where: { id: reported } }
    );

    return result;
  } catch (error) {
    throw error;
  }
}

const getCountReports = async (userid) => {
  try {
    const user = await db.users.findOne({
      where: { id: userid },
      attributes: ['reports'],
      raw: true,
    });

    return user ? user.reports : 0;
  } catch (error) {
    throw error;
  }
}

const setFamerating = async (userid) => {
  try {
    const countLikes = await db.history.getCountFollowers(userid);
    const countViews = await db.history.getCountViews(userid);
    const countReports = await getCountReports(userid);

    const rate = (countLikes / 5) + (countViews / 10) - (countReports / 10);

    await db.users.update(
      { fame: rate },
      { where: { id: userid } }
    );

  } catch (error) {
    throw error;
  }
}

const deleteOne = async (where) => {
  try {
    const result = await db.users.destroy({
      where: where,
    });

    return result;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  findOne, save, findOneAndUpdate, findNewUsername, findNewEmail, loadProfile, loadUser, findSuggestions, search, getStatus, setStatus, report, getCountReports, setFamerating, deleteOne
}