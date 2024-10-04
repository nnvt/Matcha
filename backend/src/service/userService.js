import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);
import db from '../models/index';


const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
}

const createNewUser = async (email, username, password, firstname, lastname) => {
    let hashpass = hashUserPassword(password);
    try {
        await db.users.create({
            email: email,
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname
        })
    } catch (error) {
        console.log(error);
    }
}

const getUserList = async () => {
    let users = [];
    try {
        users = await db.users.findAll();
    } catch (error) {
        console.log(error);
    }

    return users;
}

const deleteUser = async (userId) => {
    await db.users.destroy({
        where: {
            id: userId
        },
    });
}

const getUserbyID = async (userid) => {
    let user = {};
    user = await db.users.findOne({
        where: { id: userid }
    })
}

module.exports = {
    createNewUser, getUserList, deleteUser, getUserbyID
}