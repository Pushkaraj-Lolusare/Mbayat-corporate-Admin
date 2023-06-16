const CorporateLoginLogModel = require("../model/corporateWebLog.model");

const captureLoginDetails = async (req, res, next) => {
  const { userId } = req.User;
  const { browserName, ipAddress } = req;

  const loginActivity = new CorporateLoginLogModel({
    userId,
    browserName,
    ipAddress,
    loginTime: moment().toISOString(),
  });

  await loginActivity.save();

  next();
};

// Middleware function to capture logout details
const captureLogoutDetails = (req, res, next) => {
  const logoutTime = new Date();

  req.logoutDetails = { logoutTime };

  next();
};

module.exports = {captureLoginDetails};