const express = require("express");
const router = express.Router();
const crypto_JS = require("crypto-js");
const User = require("../schemas/userSchema");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const Joi = require("joi");
const auth = require("../middlewares/auth-middleware");
require("dotenv").config();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// 회원가입
router.post("/signup", async (req, res) => {
    // validation
    const userSchema = joi.object({
        userId: joi
            .string()
            .pattern(/[A-Za-z\d]/)
            .min(6)
            .max(16)
            .required(),
        email: joi.string().email().required(),
        userName: joi
            .string()
            .pattern(/[A-Za-z가-힣\d]/)
            .min(2)
            .max(8)
            .required(),
        password: joi
            .string()
            .pattern(/(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^*_-])[A-Za-z\d!@#$%^*_-]/)
            .min(8)
            .max(16)
            .required(),
        confirmPW: joi.required(),
    });
    try {
        const { userId, userName, email, password, confirmPW } = await userSchema.validateAsync(req.body);
        const checkUser = await User.findOne({ userId });
        if (password !== confirmPW) {
            return res.status(400).send({ message: "입력하신 비밀번호와 비밀번호 확인과 다릅니다." });
        }

        if (checkUser) {
            return res.status(400).send({ message: "이미 존재하는 아이디입니다." });
        }

        const privateKey = process.env.CRYPTO_JS_KEY;
        const encrypted = crypto_JS.AES.encrypt(JSON.stringify(password), privateKey).toString();

        await User.create({ userId, userName, email, password: encrypted });
        res.status(200).send({ message: "회원가입이 완료되었습니다." });
    } catch (error) {
        let joiError = error.details[0].message;
        console.log(joiError);
        if (joiError.includes("userId")) {
            return res.status(400).send({ message: "아이디는 6자 이상, 16자 이하의 영어 대소문자 및 숫자입니다." });
        } else if (joiError.includes("password")) {
            return res.status(400).send({
                message:
                    "비밀번호는 최소 8자 이상, 16자 이하의 영어 대소문자 및 숫자, 특수문자(!@#$%^*_-)로 이루어져야 합니다.",
            });
        }
    }
});

// 로그인
router.post("/login", async (req, res) => {
    try {
        const { userId, password } = req.body;

        const privateKey = process.env.CRYPTO_JS_KEY;

        const checkUser = await User.findOne({ userId });

        if (checkUser === null) {
            return res.status(400).send({ message: "존재하지 않는 ID입니다. 회원 가입 후 로그인하세요." });
        }

        const originalPW = crypto_JS.AES.decrypt(checkUser.password, privateKey);
        const decrypted = JSON.parse(originalPW.toString(crypto_JS.enc.Utf8));
        if (decrypted !== password) {
            return res.status(400).send({ message: "비밀번호를 다시 확인해주세요." });
        }

        const token = jwt.sign(
            {
                userId: checkUser.userId,
                userName: checkUser.userName,
            },
            process.env.TOKEN_SECRET_KEY
        );
        res.status(200).send({
            token,
            message: `${checkUser.userName}님, 로그인 되었습니다.`,
        });
    } catch (error) {
        res.status(400).send({ message: "오류가 발생했습니다. 관리자에게 문의하세요." });
    }
});

// 비밀번호 변경
router.post("/changePw", auth, async (req, res) => {
    try {
        const userSchema = joi.object({
            password: Joi.required(),
            newPassword: joi
                .string()
                .pattern(/(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^*_-])[A-Za-z\d!@#$%^*_-]/)
                .required(),
            confirmPW: joi
                .string()
                .pattern(/(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^*_-])[A-Za-z\d!@#$%^*_-]/)
                .required(),
        });
        const { user } = res.locals;
        const { password, newPassword, confirmPW } = await userSchema.validateAsync(req.body);

        const decrypted = crypto_JS.AES.decrypt(user.password, process.env.CRYPTO_JS_KEY);
        const parseDecrypted = JSON.parse(decrypted.toString(crypto_JS.enc.Utf8));

        if (parseDecrypted !== password) {
            return res.status(400).send({ message: "입력하신 비밀번호가 기존의 비밀번호와 다릅니다." });
        }

        if (newPassword !== confirmPW) {
            return res.status(400).send({ message: "바꾸실 비밀번호와 확인란이 다릅니다." });
        }

        const encryptedNewPassword = crypto_JS.AES.encrypt(
            JSON.stringify(newPassword),
            process.env.CRYPTO_JS_KEY
        ).toString();

        await User.updateOne({ userId: user.userId }, { $set: { password: encryptedNewPassword } });

        res.status(200).send({ message: "비밀번호가 변경되었습니다." });
    } catch (error) {
        let joiError = error.details[0].message;
        if (joiError.includes("newPassword")) {
            return res.status(400).send({
                message:
                    "비밀번호는 최소 8자 이상, 16자 이하의 영어 대소문자 및 숫자, 특수문자(!@#$%^*_-)로 이루어져야 합니다.",
            });
        }
    }
});
module.exports = router;
