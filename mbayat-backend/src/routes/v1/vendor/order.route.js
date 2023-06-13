const express = require("express");
const auth = require("../../../middlewares/auth");
const validate = require("../../../middlewares/validate");
const { vendorOrderController } = require("../../../controllers");
const { vendorOrderValidation } = require("../../../validations");

const router = express.Router();

router.get(
  "/order-by-vendor/:vendorId",
  auth(),
  vendorOrderController.orderByVendor
);
router.post(
  "/update-order-status",
  auth(),
  validate(vendorOrderValidation.updateOrderStatus),
  vendorOrderController.updateOrderStatus
);
router.get(
  "/vendor-order-details/:orderId",
  auth(),
  vendorOrderController.orderDetailsByVendor
);

router.get(
  "/product-reviews-by-vendor/:vendorId",
  auth(),
  vendorOrderController.getProductReviewByOrders
);

router.post("/create-mystery-box", vendorOrderController.createMysteryBox);
router.get(
  "/history-of-mystery-box",
  vendorOrderController.geHistoryOfMysteryBox
);

router.get(
  "/get-mystery-box-by-date",
  vendorOrderController.getMysteryBoxByDate
);

router.get(
  "/get-mystery-box-for-admin",
  vendorOrderController.getMysteryBoxForAdmin
);

module.exports = router;
