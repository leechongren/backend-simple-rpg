const jwt = require("jsonwebtoken")

const getJWTSecret = () => {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
        throw new Error("Missing secrets to sign JWT token");
    }
    return secret;
};

const createJWToken = (username) => {
    const payload = { name: username };
    const token = jwt.sign(payload, getJWTSecret());
    return token
}

module.exports = { getJWTSecret, createJWToken }