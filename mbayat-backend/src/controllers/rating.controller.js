const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { ratingService } = require("../services");
const pick = require("../utils/pick");

const addRatingToProduct = catchAsync(async (req, res) => {
  const add = await ratingService.addRatingToProduct(req.body);
  res.status(httpStatus.OK).json(add);
});

const getRatingByUser = catchAsync(async (req, res) => {
  const get = await ratingService.getRatingByUser(req.params.userId);
  res.status(httpStatus.OK).json(get);
});

const getRatingByProduct = catchAsync(async (req, res) => {
  const get = await ratingService.getRatingByProduct(req.params.productId);
  res.status(httpStatus.OK).json(get);
});

const getAllRatingList = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ["sortBy", "limit", "page", "populate"]);
  const result = await ratingService.getAllRatingList(filter, options);
  res.send(result);
});

const editRating = catchAsync(async (req, res) => {
  const edit = await ratingService.editRating(req.body);
  res.status(httpStatus.OK).json(edit);
});

const deleteRating = catchAsync(async (req, res) => {
  const remove = await ratingService.deleteRating(req.body);
  res.status(httpStatus.OK).json(remove);
});

module.exports = {
  addRatingToProduct,
  getRatingByUser,
  getRatingByProduct,
  getAllRatingList,
  editRating,
  deleteRating,
};
