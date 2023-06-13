const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { cartService } = require("../services");

const addToCart = catchAsync(async (req, res) => {
  const user = await cartService.addToCart(req.body);
  res.status(httpStatus.OK).send(user);
});

const getCartByUser = catchAsync(async (req, res) => {
  const get = await cartService.getCartByUser(req.params.userId);
  res.status(httpStatus.OK).send(get);
});

const updateCart = catchAsync(async (req, res) => {
  const update = await cartService.updateCart(req.body);
  res.status(httpStatus.OK).send(update);
});

const deleteCart = catchAsync(async (req, res) => {
  const remove = await cartService.deleteCart(req.body);
  res.status(httpStatus.OK).send(remove);
});

module.exports = {
  addToCart,
  getCartByUser,
  updateCart,
  deleteCart,
};
