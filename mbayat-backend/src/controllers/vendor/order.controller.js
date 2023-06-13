const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { vendorOrderService } = require("../../services");

const orderByVendor = catchAsync(async (req, res) => {
  const getOrders = await vendorOrderService.orderByVendor(
    req.params.vendorId,
    req.query
  );
  res.status(httpStatus.OK).json(getOrders);
});

const orderDetailsByVendor = catchAsync(async (req, res) => {
  const get = await vendorOrderService.orderDetailsByVendor(req.params.orderId);
  res.status(httpStatus.OK).json(get);
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const get = await vendorOrderService.updateOrderStatus(req.body);
  res.status(httpStatus.OK).json(get);
});


const getProductReviewByOrders = catchAsync(async (req, res) => {
  const get = await vendorOrderService.getProductReviewByOrders(req.params.vendorId);
  res.status(httpStatus.OK).json(get);
});

const createMysteryBox = catchAsync(async (req, res) => {
  const mysteryBox = await vendorOrderService.createMysteryBox(req.body);
  res.status(httpStatus.OK).json(mysteryBox);
});

const geHistoryOfMysteryBox = catchAsync(async (req, res) => {
  const mysteryBox = await vendorOrderService.geHistoryOfMysteryBox(req.query);
  res.status(httpStatus.OK).json(mysteryBox);
});

const getMysteryBoxByDate = catchAsync(async (req, res) => {
  const mysteryBox = await vendorOrderService.getMysteryBoxByDate(req.query);
  res.status(httpStatus.OK).json(mysteryBox);
});

const getMysteryBoxForAdmin = catchAsync(async (req, res) => {
  const mysteryBox = await vendorOrderService.getMysteryBoxForAdmin(req.query);
  res.status(httpStatus.OK).json(mysteryBox);
});

module.exports = {
  orderByVendor,
  orderDetailsByVendor,
  updateOrderStatus,
  getProductReviewByOrders,
  createMysteryBox,
  geHistoryOfMysteryBox,
  getMysteryBoxByDate,
  getMysteryBoxForAdmin,
};
