const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    const secret = 'pppppp';

    if (token) {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: err });
                console.error('Error decoding token:', err);
            } else {
                return res.status(401).json({ message: decoded });
                //console.log('Decoded token:', decoded);
            }
        });
       
     
    }

    try {
        const decoded = jwt.verify(token, "ppppp");
        req.userId = 1;//decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: error });
    }
};

module.exports = verifyToken;
