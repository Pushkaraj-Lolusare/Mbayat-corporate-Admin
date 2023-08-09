const mongoose = require("mongoose")

const CorporateUserSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    companyType: {
        type: String,
        required: true,
    },
    industry: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
    }
}, {
    versionKey: false
});


const CorporateUserModel = mongoose.model("CorporateUser", CorporateUserSchema)
module.exports = CorporateUserModel