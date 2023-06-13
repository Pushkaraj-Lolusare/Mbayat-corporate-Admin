const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { subscriptionService } = require("../services");
const pick = require("../utils/pick");

const createSubscription = catchAsync(async (req, res) => {
  const create = await subscriptionService.createSubscription(req.body);
  res.status(httpStatus.OK).json(create);
});


const getUserSubscriptionLists = catchAsync(async (req, res) => {

  const queryObj = req.query;
  queryObj.userId = req.params.userId;
  const filter = pick(req.query, ["userId", "fetchType"]);
  const options = pick(
    {
      queryObj,
      ...{
        populate: "userId",
      },
    },
    ["sortBy", "limit", "page", "populate", "fetchType"]
  );

  const get = await subscriptionService.getUserSubscriptionLists(
    filter,
    options
  );
  res.status(httpStatus.OK).json(get);
});

const updateSubscription = catchAsync(async (req, res) => {
  const update = await subscriptionService.updateSubscription(req.body);
  res.status(httpStatus.OK).json(update);
});

module.exports = {
  createSubscription,
  getUserSubscriptionLists,
  updateSubscription,
};
