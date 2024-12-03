const bcrypt = require("bcrypt");
const crypto = require("crypto");

// tạo một hàm băm (hash) cho mật khẩu
const hashPassword = (text) => {
    return bcrypt.hashSync(text, 11);
};

// so sánh mật khẩu đầu vào với hàm băm
const compareHash = async (text, hash) => {
    return await bcrypt.compare(text, hash);
};

const hash = (text) => {
    const salt = crypto.randomBytes(16).toString('hex');
    return crypto.pbkdf2Sync(text, salt, 875492, 64, `sha512`).toString(`hex`);
};


module.exports = {
    generatePasswordToken: (password) => hashPassword(password),
    generateToken: (text) => hash(text),
    compare: (password, hash) => compareHash(password, hash),
};
