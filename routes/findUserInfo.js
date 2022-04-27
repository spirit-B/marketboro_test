const nodeMailer = require("nodemailer");
const User = require("../schemas/userSchema");
const crypto_JS = require("crypto-js");
const router = require("./user");
require("dotenv").config();

// ID 찾기
router.post("/findId", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).send({ message: "이메일을 입력해주세요." });

        const postEmail = process.env.EMAIL;
        const postEmailPW = process.env.EMAILPW;

        const findIdUser = await User.findOne({ email });

        let transport = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: postEmail,
                pass: postEmailPW,
            },
        });

        if (findIdUser) {
            const emailReceiver = findIdUser.email;
            let mailOptions = {
                from: postEmail,
                to: emailReceiver,
                subject: "문의하신 ID를 찾아서 보내드립니다.",
                text: `안녕하세요. 고객님께서 가입하신 아이디는 ${findIdUser.userId} 입니다.\n 감사합니다.`,
            };

            transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(400).send({ message: "처리 중 오류가 발생했습니다. 관리자에게 문의하세요." });
                }
            });
        } else {
            return res.status(400).send({ message: "존재하지 않는 회원정보입니다." });
        }

        res.status(200).send({ message: "이메일로 ID를 보내드렸습니다. 메일을 확인해주세요." });
    } catch (error) {
        return res.status(400).send({ message: "처리 중 오류가 발생했습니다. 관리자에게 문의하세요." });
    }
});

// 비밀번호 찾기
router.post("/findPw", async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) return res.status(400).send({ message: "비밀번호를 찾으시려는 ID를 입력해주세요." });

        const postEmail = process.env.EMAIL;
        const postEmailPW = process.env.EMAILPW;

        const findPwUser = await User.findOne({ userId });

        let transport = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: postEmail,
                pass: postEmailPW,
            },
        });

        // 임시 비밀번호 생성 함수
        function createCode(iLength) {
            let characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^*_-";
            let randomStr = "";
            for (let i = 0; i < iLength; i++) {
                randomStr += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return randomStr;
        }
        let randomPw = createCode(12);

        if (findPwUser) {
            const emailReceiver = findPwUser.email;
            // 해당 ID의 비밀번호를 임시 비밀번호로 변경
            const encrypted = crypto_JS.AES.encrypt(JSON.stringify(randomPw), process.env.CRYPTO_JS_KEY).toString();

            await User.updateOne({ userId }, { $set: { password: encrypted } });

            let mailOptions = {
                from: postEmail,
                to: emailReceiver,
                subject: "비밀번호 찾기 문의 결과입니다.",
                text: `안녕하세요. ${userId}님! 임시 비밀번호는 ${randomPw}입니다.\n 임시 비밀번호이니, 로그인 후 비밀번호를 꼭 변경하여 이용하시길 바랍니다.`,
            };

            transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(400).send({ message: "처리 중 오류가 발생했습니다. 관리자에게 문의하세요." });
                }
            });
        } else if (findPwUser === null) {
            return res.status(400).send({ message: "존재하지 않는 회원정보입니다." });
        }
        res.status(200).send({
            message: "가입하신 ID의 이메일로 임시 비밀번호를 보내드렸습니다.\n 이메일을 확인해주세요.",
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: "오류가 발생했습니다. 관리자에게 문의하세요." });
    }
});

module.exports = router;
