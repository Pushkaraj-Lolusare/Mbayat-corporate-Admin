const Joi = require("joi");

const updateOrderStatus = {
  body: Joi.object().keys({
    vendorId: Joi.string().required(),
    orderId: Joi.string().required(),
    status: Joi.string().required(),
  }),
};

module.exports = {
  updateOrderStatus,
};
