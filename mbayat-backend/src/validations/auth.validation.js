const Joi = require("joi");
const { password } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    first_name: Joi.string().allow().default(""),
    last_name: Joi.string().allow().default(""),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    confirm_password: Joi.string().required().equal(Joi.ref("password")),
    mobile_number: Joi.string().allow().default(""),
    date_of_birth: Joi.string().required(),
    interests: Joi.string().required(),
    subInterests: Joi.string().required(),
    gender: Joi.string().allow().default(""),
    country_code: Joi.string().allow().default(""),
    role: Joi.string().valid("user", "admin", "master_admin"),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    otp: Joi.number().required(),
    newPassword: Joi.string().required().custom(password),
    confirmPassword: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
