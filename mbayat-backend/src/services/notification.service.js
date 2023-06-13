const { Notification } = require("../models");

const getNotificationByUser = async (userId) => {
  const get = await Notification.find({ userId, status: "unread" })
    .sort({ createdAt: -1 })
    .then((res) => {
      if (res) {
        return {
          status: "success",
          message: "User all notification list",
          data: res,
        };
      }
      return {
        status: "failed",
        message: "User notification list not found.",
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err.message,
      };
    });

  return get;
};

const markAsRead = async (reqBody) => {
  const { userId, notificationId } = reqBody;
  const remove = await Notification.updateOne(
    { _id: notificationId, userId },
    { status: "read" }
  )
    .then((res) => {
      if (res) {
        return {
          status: "success",
          message: "Notification marked as read successfully.",
        };
      }
      return {
        status: "failed",
        message:
          "Something went wrong while updating notification status, Please try again or later.",
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err.message,
      };
    });

  return remove;
};

const getNotificationDetails = async (notficationId) => {
  const getNotificationId = await Notification.findOne({
    _id: notficationId,
  }).then((res) => {
    return res;
  });

  if (getNotificationId) {
    return {
      status: "success",
      message: "Here is notification details",
      data: getNotificationId,
    };
  }

  return {
    status: "failed",
    message: "Something went wrong while getting notification.",
  };
};

module.exports = {
  getNotificationByUser,
  markAsRead,
  getNotificationDetails,
};
