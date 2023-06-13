const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { notificationService } = require("../services");

const getNotificationByUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const get = await notificationService.getNotificationByUser(userId);
  res.status(httpStatus.OK).json(get);
});

const markAsRead = catchAsync(async (req, res) => {
  const add = await notificationService.markAsRead(req.body);
  res.status(httpStatus.OK).json(add);
});

const getNotificationDetails = catchAsync(async (req, res) => {
  const get = await notificationService.getNotificationDetails(req.params.notificationId);
  res.status(httpStatus.OK).json(get);
});

module.exports = {
  getNotificationByUser,
  markAsRead,
  getNotificationDetails,
};
