const express = require("express");
const auth = require("../../middlewares/auth");
const { orderController } = require("../../controllers");

const router = express.Router();

router.post("/place-order", auth(), orderController.placeOrder);
router.get(
  "/get-user-order-list/:userId",
  auth(),
  orderController.getOrderByUser
);

router.get("/all-order-lists", auth(), orderController.allOrderList);
router.get("/get-order-details/:orderId", orderController.getOrderDetails);
module.exports = router;
