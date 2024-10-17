const jwt = require('jsonwebtoken');
const secret = 'mysecret';

function createTokenForUser(user) {
    const payload = 
    {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role
    }
    return jwt.sign(payload, secret,  { expiresIn: '1h' });
}

function validateToken(token) {
    return jwt.verify(token, secret);
}

module.exports = { createTokenForUser, validateToken };