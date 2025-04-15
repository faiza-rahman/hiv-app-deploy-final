const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const createToken = async (tokenData, tokenKey = process.env.TOKEN_KEY, expiresIn = process.env.TOKEN_EXPIRY ) => {
    try {
        const token = await jwt.sign(tokenData, tokenKey, { expiresIn });
        return token;
    } catch (error) {
        throw Error(error.message);
    }
};

module.exports = createToken;