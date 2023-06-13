const Joi = require("joi");

const addRatingValidation = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    orderId: Joi.string().required(),
    vendorId: Joi.string().required(),
    productId: Joi.string().required(),
    rating: Joi.number().required().max(5),
    review: Joi.string().required(),
  }),
};

const getRatingByUserValidation = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const getRatingByProductValidation = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
  }),
};

const editRatingValidation = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    reviewId: Joi.string().required(),
    rating: Joi.number().required().max(5),
    review: Joi.string().required(),
  }),
};

const deleteRatingValidation = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    reviewId: Joi.string().required(),
  }),
};

module.exports = {
  addRatingValidation,
  getRatingByUserValidation,
  editRatingValidation,
  getRatingByProductValidation,
  deleteRatingValidation,
};
