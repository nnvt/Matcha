import mysql from 'mysql2';

//create connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234buonluon',
    database: 'jwt'
});

const handleHelloWorld = (req, res) => {
    return res.render("home.ejs");
}

const handleUserPage = (req, res) => {
    return res.render("user.ejs");
}

const handleCreateUser = (req, res) => {
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;


    connection.query(
        `insert into user(email,username,password) values(?,?,?)`, [email, username, password],
        function (err, results, fields) {
            if (err) {
                console.log(err);
            }
        }
    )
    return res.send("Created user");
}
module.exports = {
    handleHelloWorld, handleUserPage, handleCreateUser
}