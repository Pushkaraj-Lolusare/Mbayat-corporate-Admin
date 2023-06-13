const express = require("express");
const auth = require("../../middlewares/auth");
const { notificationController } = require("../../controllers");
const { notificationValidation } = require("../../validations");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.get(
  "/get-user-notification/:userId",
  auth(),
  validate(notificationValidation.getWishlistByUser),
  notificationController.getNotificationByUser
);
router.post(
  "/mark-as-read",
  auth(),
  validate(notificationValidation.markAsRead),
  notificationController.markAsRead
);

router.get(
  "/get-notification-details/:notificationId",
  notificationController.getNotificationDetails
);

module.exports = router;
