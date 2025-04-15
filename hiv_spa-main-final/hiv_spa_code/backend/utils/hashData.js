const bcrypt = require('bcrypt');

const hashData = async (data, saltRounds = 10) => {
    try {
        const hashedData = await bcrypt.hash(data, saltRounds);
        return hashedData;
    } catch (error) {
        throw Error('Error hashing data');
    }
};

const verifyHashdata = async (data, hashedData) => {
    try {
        const isMatch = await bcrypt.compare(data, hashedData);
        return isMatch;
    } catch (error) {
        throw Error('Error verifying data');
    }
};

module.exports = { hashData, verifyHashdata };