import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

import mysql from 'mysql2';

//create connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234buonluon',
    database: 'jwt'
});

const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
}

const createNewUser = (email, username, password) => {
    let hashpass = hashUserPassword(password);
    connection.query(
        `insert into user(email,username,password) values(?,?,?)`, [email, username, hashpass],
        function (err, results, fields) {
            if (err) {
                console.log(err);
            }
        }
    )
}

module.exports = {
    createNewUser
}