const User = require('../models/user');

let auth = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
        let token = req.headers.authorization.split(' ')[1];
        User.findByToken(token, (err, user) => {
            if (err) throw err;
            if (!user) return res.json({
                error: "Token không đúng"
            });

            req.token = token;
            req.user = user;
            next();

        })
    }
    return res.status(400).json({
        message: "Token bị bỏ trống"
    });
    
}

module.exports = { auth };

