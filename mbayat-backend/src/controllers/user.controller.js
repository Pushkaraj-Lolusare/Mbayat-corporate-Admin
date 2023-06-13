const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filterQuery = req.query;
  if (req.query.interestId) {
    filterQuery.interests = { $in: [req.query.interestId] };
  }

  if (!filterQuery.role) {
    filterQuery.role = { $ne: "master_admin" };
  }

  const filter = pick(filterQuery, [
    "status",
    "role",
    "interests",
    "gender",
    "age",
  ]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  const removeUser = await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.OK).send(removeUser);
});

const userAddInterest = catchAsync(async (req, res) => {
  const add = await userService.userAddInterest(req.body);
  res.status(200).json(add);
});

const updateUserInterest = catchAsync(async (req, res) => {
  const update = await userService.updateUserInterest(
    req.params.userId,
    req.body
  );
  res.status(200).json(update);
});

const userCreateShippingAddress = catchAsync(async (req, res) => {
  const createShipping = await userService.userCreateShippingAddress(req.body);
  res.status(200).json(createShipping);
});

const getAllShippingAddress = catchAsync(async (req, res) => {
  const get = await userService.getAllShippingAddress(req.params.userId);
  res.status(200).json(get);
});

const updateShippingAddress = catchAsync(async (req, res) => {
  const update = await userService.updateShippingAddress(req.body);
  res.status(200).json(update);
});

const deleteShippingAddress = catchAsync(async (req, res) => {
  const remove = await userService.deleteShippingAddress(req.body);
  res.status(200).json(remove);
});

const getDashboardData = catchAsync(async (req, res) => {
  const get = await userService.getDashboardData(req.body);
  res.status(200).json(get);
});

const getUserSaving = catchAsync(async (req, res) => {
  const get = await userService.getUserSaving(req.params.userId);
  res.status(200).json(get);
});

const getSavingDetails = catchAsync(async (req, res) => {
  const get = await userService.getSavingDetails(
    req.params.userId,
    req.query.savingDate
  );
  res.status(200).json(get);
});

const getMysteryBoxOrders = catchAsync(async (req, res) => {
  const filterQuery = req.query;

  const filter = pick(filterQuery, ["orderType", "vendorId"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);

  const get = await userService.getMysteryBoxOrders(filter, options);
  res.status(200).json(get);
});

const getUsersMysteryBox = catchAsync(async (req, res) => {
  const get = await userService.getUsersMysteryBox(req.params.userId);
  res.status(200).json(get);
});

const getUserMysteryBoxDetails = catchAsync(async (req, res) => {
  const get = await userService.getUserMysteryBoxDetails(req.params.userId,req.params.orderDate);
  res.status(200).json(get);
});

const checkUser = catchAsync(async (req, res) => {
  const get = await userService.checkUser(req.body);
  res.status(200).json(get);
});

const clearDatabase = catchAsync(async (req, res) => {
  const get = await userService.clearDatabase(req.body);
  res.status(200).json(get);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  userAddInterest,
  updateUserInterest,
  userCreateShippingAddress,
  getAllShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  getDashboardData,
  getUserSaving,
  getSavingDetails,
  getMysteryBoxOrders,
  getUsersMysteryBox,
  checkUser,
  clearDatabase,
  getUserMysteryBoxDetails,
};
