const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { vendorUserService } = require("../../services");

const registerVendor = catchAsync(async (req, res) => {
  const register = await vendorUserService.registerVendor(req);
  res.status(httpStatus.OK).json(register);
});

const loginVendor = catchAsync(async (req, res) => {
  const login = await vendorUserService.loginVendor(req.body);
  res.status(httpStatus.OK).json(login);
});

const removeVendor = catchAsync(async (req, res) => {
  const remove = await vendorUserService.removeVendor(req.body);
  res.status(httpStatus.OK).json(remove);
});

const getVendorDetails = catchAsync(async (req, res) => {
  const get = await vendorUserService.getVendorDetails(req.params.vendorId);
  res.status(httpStatus.OK).json(get);
});

const updateVendor = catchAsync(async (req, res) => {
  const update = await vendorUserService.updateVendor(req);
  res.status(httpStatus.OK).json(update);
});

const skipThisMonth = catchAsync(async (req, res) => {
  const update = await vendorUserService.skipThisMonth(req.body);
  res.status(httpStatus.OK).json(update);
});

const unSkipThisMonth = catchAsync(async (req, res) => {
  const update = await vendorUserService.unSkipThisMonth(req.body);
  res.status(httpStatus.OK).json(update);
});
module.exports = {
  registerVendor,
  loginVendor,
  removeVendor,
  updateVendor,
  getVendorDetails,
  skipThisMonth,
  unSkipThisMonth,
};
