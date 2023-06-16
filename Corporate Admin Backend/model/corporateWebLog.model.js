const mongoose = require('mongoose');

const corporateLoginLogSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            ref: 'User'
            // required: true,
        },
        browserName: {
            type: String,
            required: true,
        },
        ipAddress: {
            type: String,
            required: true,
        },
        loginTime: {
            type: Date,
            required: true,
        },
        logoutTime: {
            type: Date,
        },
    
    },
    {
        timestamps: true,
    }
);



const CorporateLoginLogModel = mongoose.model('LoginLog', corporateLoginLogSchema);

module.exports = CorporateLoginLogModel;
