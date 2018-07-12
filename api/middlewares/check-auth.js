const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log(req.headers.authorization.split(" ")[1])
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        res.locals.userData = decoded;
        console.log(decoded);
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: 'Auth failed',
            err: error
        });
    }
}