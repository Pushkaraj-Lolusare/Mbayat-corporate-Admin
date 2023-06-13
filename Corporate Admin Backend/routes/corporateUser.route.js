const express = require("express")
const corporateUserRouter = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const CorporateUserModel = require("../model/corporateUser.model")
const { sendUserCredentials } = require('../mailer/email');
const multer = require('multer');
// const storage = require

corporateUserRouter.get("/", async (req, res) => {
    try {
        const data = await CorporateUserModel.find()
        res.send(data)
    } catch (e) {
        res.send(e)
    }
})

// const upload = multer({ storage: storage });


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
    console.log(req.body);
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                console.log(err);
            } else {
                let ExistingUser = await CorporateUserModel.findOne({ email: email })
                if (ExistingUser) {
                    return res.status(400).send({ msg: "User Already Exists, Try Login!" })
                }
                else if (password !== confirmPassword) {
                    return res.status(400).json({ message: 'Passwords do not match' });
                } else {
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
                    res.status(201).send({ msg: "Registration successful", user: newUser, userId : userId })
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
            bcrypt.compare(password, User[0].password, (err, result) => {
                if (result) {
                    // console.log(result)
                    
                    let token = jwt.sign({ userId: User[0]._id }, process.env.key);
                    res.status(201).send({ msg: `Welcome ${User[0].companyName} Admin`, token: token, userId: User[0]._id , CompanyName: User[0].companyName,  Email: User[0].email});
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



module.exports = corporateUserRouter