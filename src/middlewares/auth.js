const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send('Unauthorized');
        }

        const decoded = jwt.verify(token, "devtinder@1234$");
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            return res.status(401).send('Unauthorized');
        }

        req.user = user;
        next();
    }
    catch (error) {

        res.status(401).send('Unauthorized');
    }
}

module.exports = userAuth