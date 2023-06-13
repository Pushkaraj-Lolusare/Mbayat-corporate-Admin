const express = require("express");
const auth = require("../../middlewares/auth");
const { giftController } = require("../../controllers");

const router = express.Router();

router.post(
  "/send-subscription-as-gift",
  auth(),
  giftController.giftSubscription
);

router.post("/send-box-as-gift", auth(), giftController.sendBoxAsGift);
router.get(
  "/get-gift-history-by-user/:userId/:type",
  auth(),
  giftController.getGiftHistoryByUser
);
router.get(
  "/get-all-gift-history",
  auth(),
  giftController.getAllGiftUserHistory
);

module.exports = router;
