const Joi = require("joi");
const { password } = require("./custom.validation");

const createAdminUser = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    confirm_password: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
    country_code: Joi.string().required(),
    mobile_number: Joi.string().required(),
    gender: Joi.string().required().valid("Male", "FeMale"),
    permissions: Joi.array().required(),
  }),
};

const editAdminUser = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    country_code: Joi.string().required(),
    mobile_number: Joi.any().required(),
    gender: Joi.string().required().valid("Male", "FeMale"),
    permissions: Joi.array().required(),
    interests: Joi.allow(),
    role: Joi.allow(),
    isEmailVerified: Joi.allow(),
    otp: Joi.allow(),
    status: Joi.allow(),
    id: Joi.allow(),
  }),
};

module.exports = {
  createAdminUser,
  editAdminUser,
};
