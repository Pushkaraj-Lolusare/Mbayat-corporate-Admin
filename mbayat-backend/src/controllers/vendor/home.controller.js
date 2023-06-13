const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { vendorHomeService } = require("../../services");
const pick = require("../../utils/pick");

const getHomeData = catchAsync(async (req, res) => {
  const get = await vendorHomeService.getHomeData(req.params.userId);
  res.status(httpStatus.OK).json(get);
});

const getAllVendorLists = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["status", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page", "fetchType"]);
  const result = await vendorHomeService.getAllVendorLists(filter, options);
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  getHomeData,
  getAllVendorLists,
};
