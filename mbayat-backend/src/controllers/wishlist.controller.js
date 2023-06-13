const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { wishlistService } = require("../services");

const createWishlist = catchAsync(async (req, res) => {
  const create = await wishlistService.createWishlist(req.body);
  res.status(httpStatus.OK).json(create);
});

const getWishlistByUser = catchAsync(async (req, res) => {
  const { userId } = req.query;
  const get = await wishlistService.getWishlistByUser(userId);
  res.status(httpStatus.OK).json(get);
});

const deleteWishlistById = catchAsync(async (req, res) => {
  const { wishlistId } = req.body;
  const remove = await wishlistService.deleteWishlist(wishlistId);
  res.status(httpStatus.OK).json(remove);
});

module.exports = {
  createWishlist,
  getWishlistByUser,
  deleteWishlistById,
};
