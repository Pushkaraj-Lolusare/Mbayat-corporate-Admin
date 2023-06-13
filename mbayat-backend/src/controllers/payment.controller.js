const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { paymentService } = require("../services");
const pick = require("../utils/pick");

const createPayment = catchAsync(async (req, res) => {
  const create = await paymentService.createPayment(req.body);
  res.status(httpStatus.OK).json(create);
});

const getAllPayments = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    "paymentStatus",
    "vendorId",
    "paymentMonths",
  ]);
  const queryObj = req.query;

  const options = pick(
    {
      ...queryObj,
      ...{
        populate: "userId",
      },
    },
    ["populate", "limit", "page", "fetchType", "vendorId", "paymentMonths"]
  );
  const get = await paymentService.getAllPaymentList(filter, options);
  res.status(httpStatus.OK).json(get);
});

const updatePayment = catchAsync(async (req, res) => {
  const update = await paymentService.editPayment(req.body);
  res.status(httpStatus.OK).json(update);
});

const addUserPaymentMethod = catchAsync(async (req, res) => {
  const add = await paymentService.addUserPaymentMethod(req.body);
  res.status(httpStatus.OK).json(add);
});

const changeDefaultPaymentMethod = catchAsync(async (req, res) => {
  const change = await paymentService.changeDefaultPaymentMethod(req.body);
  res.status(httpStatus.OK).json(change);
});

const getAllPaymentMethodByUser = catchAsync(async (req, res) => {
  const get = await paymentService.getAllPaymentMethodByUser(req.params.userId);
  res.status(httpStatus.OK).json(get);
});

const getUserDefaultPaymentMethod = catchAsync(async (req, res) => {
  const get = await paymentService.getUserDefaultPaymentMethod(
    req.params.userId
  );
  res.status(httpStatus.OK).json(get);
});

const editPaymentMethod = catchAsync(async (req, res) => {
  const edit = await paymentService.editPaymentMethod(req.body);
  res.status(httpStatus.OK).json(edit);
});

const deletePaymentMethod = catchAsync(async (req, res) => {
  const remove = await paymentService.deletePaymentMethod(req.body);
  res.status(httpStatus.OK).json(remove);
});

const fetchAllPayments = catchAsync(async (req, res) => {
  const get = await paymentService.fetchAllPaymentService();
  res.status(httpStatus.OK).json(get);
});

const paymentSuccess = catchAsync(async (req, res) => {
  const get = await paymentService.paymentSuccess(req);
  res.status(httpStatus.OK).json(get);
});

const savePaymentId = catchAsync(async (req, res) => {
  const save = await paymentService.savePaymentId(req.body);
  res.status(httpStatus.OK).json(save);
});

const checkPaymentTracking = catchAsync(async (req, res) => {
  const save = await paymentService.checkPaymentTracking(req.body);
  res.status(httpStatus.OK).json(save);
});

module.exports = {
  createPayment,
  getAllPayments,
  updatePayment,
  addUserPaymentMethod,
  changeDefaultPaymentMethod,
  getAllPaymentMethodByUser,
  getUserDefaultPaymentMethod,
  editPaymentMethod,
  deletePaymentMethod,
  fetchAllPayments,
  paymentSuccess,
  savePaymentId,
  checkPaymentTracking,
};
