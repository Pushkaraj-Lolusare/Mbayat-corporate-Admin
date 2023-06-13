const Joi = require("joi");

const getWishlistByUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const markAsRead = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    notificationId: Joi.string().required(),
  }),
}

module.exports = {
  getWishlistByUser,
  markAsRead,
};
