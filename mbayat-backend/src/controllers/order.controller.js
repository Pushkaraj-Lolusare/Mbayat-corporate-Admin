const httpStatus = require("http-status");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const { orderService } = require("../services");

const placeOrder = catchAsync(async (req, res) => {
  const place = await orderService.placeOrder(req.body);
  res.status(httpStatus.OK).json(place);
});

const getOrderByUser = catchAsync(async (req, res) => {
  const queryObj = req.query;
  const filter = pick(req.query, ["orderType", "orderStatus", "status"]);
  const options = pick(
    {
      queryObj,
      ...{
        populate: "userId,vendorId,productId,shippingAddressId",
      },
    },
    ["sortBy", "limit", "page", "populate", "status"]
  );

  const getOrder = await orderService.getOrderByUser(
    req.params.userId,
    filter,
    options
  );
  res.status(httpStatus.OK).json(getOrder);
});

const allOrderList = catchAsync(async (req, res) => {
  const queryObj = req.query;
  const filter = pick(req.query, ["orderType", "orderStatus"]);
  const options = pick(
    {
      queryObj,
      ...{
        populate: "userId",
      },
    },
    ["sortBy", "limit", "page", "populate"]
  );

  const getLists = await orderService.allOrderList(filter, options);
  res.status(httpStatus.OK).json(getLists);
});

const getOrderDetails = catchAsync(async (req, res) => {
  const getOrder = await orderService.getOrderDetails(req.params.orderId);
  res.status(httpStatus.OK).json(getOrder);
});

module.exports = {
  placeOrder,
  getOrderByUser,
  allOrderList,
  getOrderDetails,
};
