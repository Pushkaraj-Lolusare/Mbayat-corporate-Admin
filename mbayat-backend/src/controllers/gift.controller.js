const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { giftService } = require("../services");
const pick = require("../utils/pick");

const giftSubscription = catchAsync(async (req, res) => {
  const gift = await giftService.giftSubscription(req.body);
  res.status(httpStatus.OK).json(gift);
});

const getGiftHistoryByUser = catchAsync(async (req, res) => {
  const getGifts = await giftService.getGiftHistoryByUser(
    req.params.userId,
    req.params.type
  );
  res.status(httpStatus.OK).json(getGifts);
});

const getAllGiftUserHistory = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["giftType", "sentType"]);
  const options = pick(req.query, ["sortBy", "limit", "page", "populate"]);
  const result = await giftService.getAllGiftUserHistory(filter, options);
  res.send(result);
});

const sendBoxAsGift = catchAsync(async (req, res) => {
  const gift = await giftService.sendBoxAsGift(req.body);
  res.status(httpStatus.OK).json(gift);
});

module.exports = {
  giftSubscription,
  getGiftHistoryByUser,
  getAllGiftUserHistory,
  sendBoxAsGift,
};
