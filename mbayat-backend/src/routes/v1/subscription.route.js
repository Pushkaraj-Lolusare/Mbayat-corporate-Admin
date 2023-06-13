const express = require("express");
const auth = require("../../middlewares/auth");
const { subscriptionController } = require("../../controllers");

const router = express.Router();

router.post("/buy-subscription", subscriptionController.createSubscription);
router.get(
  "/get-user-subscription-lists/:userId",
  subscriptionController.getUserSubscriptionLists
);

router.post("/update-subscription", subscriptionController.updateSubscription);

module.exports = router;
