const express = require("express");
const auth = require("../../middlewares/auth");
const { paymentController } = require("../../controllers");

const router = express.Router();

router.post("/create-payment", auth(), paymentController.createPayment);
router.get("/all-payments", auth(), paymentController.getAllPayments);
router.put("/update-payment", auth(), paymentController.updatePayment);

router.post(
  "/add-user-payment-method",
  auth(),
  paymentController.addUserPaymentMethod
);
router.post(
  "/change-default-method",
  auth(),
  paymentController.changeDefaultPaymentMethod
);

router.get(
  "/get-all-payment-method/:userId",
  auth(),
  paymentController.getAllPaymentMethodByUser
);
router.get(
  "/get-default-payment-method/:userId",
  auth(),
  paymentController.getUserDefaultPaymentMethod
);

router.put("/edit-payment-method", auth(), paymentController.editPaymentMethod);
router.delete(
  "/delete-payment-method",
  auth(),
  paymentController.deletePaymentMethod
);

router.get("/get-all-payments", paymentController.fetchAllPayments);
router.post("/paymentSuccess", paymentController.paymentSuccess);
router.post("/save-payment-id", paymentController.savePaymentId);
router.post("/track-payment", paymentController.checkPaymentTracking);

module.exports = router;
