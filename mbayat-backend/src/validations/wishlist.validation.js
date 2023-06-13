const Joi = require("joi");

const createWishlist = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    productId: Joi.string().required(),
  }),
};

const getWishlistByUser = {
  query: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const deleteWishlist = {
  body: Joi.object().keys({
    wishlistId: Joi.string().required(),
  }),
};

module.exports = {
  createWishlist,
  getWishlistByUser,
  deleteWishlist,
};
