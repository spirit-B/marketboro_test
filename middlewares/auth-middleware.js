const jwt = require("jsonwebtoken");
const User = require("../schemas/userSchema");
require("dotenv").config();

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization === undefined) {
        res.status(400).json({ errorMessage: "로그인 후 사용하세요." });
        return;
    }

    const [tokenType, tokenValue] = authorization.split(" ");

    if (tokenType != "Bearer") {
        res.status(401).json({
            errorMessage: "로그인 후 사용하세요.",
        });
        return;
    }

    try {
        const { userID } = jwt.verify(tokenValue, `${process.env.TOKEN_SECRET_KEY}`);

        User.findOne({ userID })
            .exec()
            .then((user) => {
                res.locals.user = user;
                next();
            });
    } catch (error) {
        return res.status(401).json({
            user: null,
            errorMessage: "로그인 후 사용하세요.",
        });
    }
};
