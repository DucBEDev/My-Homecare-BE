const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'jwtSecretKey';

module.exports.auth = (req, res, next) => {
    const authHeaders = req.headers['authorization'];

    if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
        return res.status(401).json({
            message: "Can't find token!"
        });
    }

    const token = authHeaders.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('Auth Middleware decoded: ', decoded);
        req.user = decoded;

        next();
    } catch (error) {
        console.log('Auth Middleware error: ', error);
        return res.status(403).json({
            message: "Invalid token or expired!"
        })
    }
}