import db from '../models/index';

const validateTag = (tagname) => {
  const regex = /^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$/;
  if (!regex.test(tagname)) {
    return new Error(`The tag name must contain only letters or numbers ( ${tagname} )!`);
  }

  if (tagname.length < 2) {
    return new Error(`The tag name < ${tagname} > must be at least 2 letters or numbers!`);
  }

  if (tagname.length > 35) {
    return new Error(`The tag name < ${tagname} > is too long!`);
  }

  return null;
}

const tagExists = async (tagname) => {
  try {
    const tag = await db.tags.findOne({
      where: {
        name: tagname.toLowerCase().trim()
      }
    });

    return tag;
  } catch (error) {
    throw new Error(`Failed to validate tag name specified <${tagname}>!`);
  }
};


const tagUserExists = async (userid, tagid) => {
  try {
    const result = await db.tags.findUserTag({ 'tag_id': tagid, 'user_id': userid });

    return result ? JSON.parse(result) : null;

  } catch (error) {
    throw error;
  }
}

const isUniqueTag = async (tagname) => {
  try {
    const tag = await tagExists(tagname);

    if (tag) {
      throw new Error("The tag name already exists!");
    }

    return;
  } catch (error) {
    throw new Error(`An error has occurred while validating tag name <${tagname}>, try again later!`);
  }
}

module.exports = {
  validateTag, tagUserExists, tagExists, isUniqueTag
}
