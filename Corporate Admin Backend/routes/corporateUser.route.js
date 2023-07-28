const express = require("express")
const corporateUserRouter = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const CorporateUserModel = require("../model/corporateUser.model")
const { sendUserCredentials, sendCorporateResetPassword } = require('../mailer/email');
const multer = require('multer');
const { captureLoginDetails } = require("../middlewares/loggerMiddleware")
const CorporateLoginLogModel = require('../model/corporateWebLog.model');
const moment = require("moment")
const useragent = require('useragent');

corporateUserRouter.get("/", async (req, res) => {
    try {
        const data = await CorporateUserModel.find()
        res.send(data)
    } catch (e) {
        res.send(e)
    }
})

// const upload = multer({ storage: storage });

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const domainRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email) && domainRegex.test(email);
}


corporateUserRouter.post("/register", async (req, res) => {
    const {
        companyName,
        companyType,
        industry,
        address,
        phoneNumber,
        email,
        password,
        confirmPassword,
    } = req.body;
    // console.log(req.body);

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
        return res.status(400).json({ msg: 'Invalid email format' });
    }
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if(companyType === ""){
                return res.status(400).json({ msg: 'Select company type' });
            }if(industry === ""){
                return res.status(400).json({ msg: 'Select industry type' });
            }if (password !== confirmPassword) {
                return res.status(400).json({ msg: 'Password and confirm password do not match' });
            } 
            if (err) {
                console.log(err);
            } else {
                let ExistingUser = await CorporateUserModel.findOne({ email: email })
                if (ExistingUser) {
                    return res.status(400).send({ msg: "User Already Exists, Try Login!" })
                }
                {
                    const newUser = new CorporateUserModel({
                        companyName,
                        companyType,
                        industry,
                        address,
                        phoneNumber,
                        email,
                        password: hash,
                        confirmPassword: undefined,
                    })
                    await newUser.save()
                    const userId = newUser._id
                    const credentials = { email, password }
                    sendUserCredentials(credentials);
                    res.status(201).send({ msg: "Registration successful", user: newUser, userId: userId })
                }
            }
        })
    } catch (e) {
        console.log(e);
        res.send(`Registration Error: - ${e}`)
    }
})


corporateUserRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        let User = await CorporateUserModel.find({ email: email })
        // console.log(User)
        if (User.length > 0) {
            bcrypt.compare(password, User[0].password, async (err, result) => {
                if (result) {
                    // console.log(result)
                    let token = jwt.sign({ userId: User[0]._id }, process.env.key);
                    const loginTime = new Date().toLocaleString(undefined, {
                        timeZone: "Asia/Kuwait",
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    });
                    const agent = useragent.parse(req.headers['user-agent']);
                    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    const loginActivity = new CorporateLoginLogModel({
                        userId: User[0]._id,
                        browserName: agent,
                        ipAddress: clientIP,
                        loginTime: loginTime
                        // logoutTime: null,

                    });
                    await loginActivity.save();
                    res.status(201).send({ msg: `Welcome ${User[0].companyName} Admin`, token: token, userId: User[0]._id, CompanyName: User[0].companyName, Email: User[0].email, Address: User[0].address });
                } else {
                    res.send({ msg: "Wrong Password" })
                }
            })
        } else {
            res.send({ msg: `Email "${email}" is not registered. Try Registering!` })
        }
    } catch (e) {
        res.send({ msg: "Error", reason: e })
    }
})

const generateRandomPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
    }
    return password;
};


corporateUserRouter.post("/reset", async (req, res) => {
    const { email } = req.body;
    try {

        const user = await CorporateUserModel.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ msg: `Invalid email address. Enter your correct email!` })
        }
        const newPassword = generateRandomPassword();

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save()

        sendCorporateResetPassword(email, newPassword)
        res.status(201).send({ msg: `New password sent on your email!` })
    } catch (e) {
        console.error('Reset password error:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = corporateUserRouter