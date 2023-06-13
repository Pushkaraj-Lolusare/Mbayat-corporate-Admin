const Joi = require("joi");
const { password } = require("../custom.validation");

const createVendorUser = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    companyName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    confirmPassword: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
    countryCode: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    country: Joi.string().optional(),
    state: Joi.string().optional(),
    city: Joi.string().optional(),
    address: Joi.string().optional(),
    postalCode: Joi.string().optional().max(10),
    serviceFor: Joi.string().optional().allow(null, ""),
    companyLogo: Joi.string().optional().allow(null, ""),
    interestId: Joi.string().required().allow(null, ""),
    subInterestId: Joi.string().required().allow(null, ""),
    status: Joi.string().optional().allow(null, ""),
    websiteLink: Joi.string().optional().allow(null, ""),
    instagramLink: Joi.string().optional().allow(null, ""),
    orderHandleBy: Joi.string().optional().allow(null, ""),
  }),
};

const loginVendor = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    otp: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  }),
};

module.exports = {
  createVendorUser,
  loginVendor,
  forgotPassword,
  resetPassword,
};
