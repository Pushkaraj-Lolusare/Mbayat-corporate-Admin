const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");

const router = express.Router();

router
  .route("/")
  .post(auth(), validate(userValidation.createUser), userController.createUser)
  .get(auth(), validate(userValidation.getUsers), userController.getUsers);

router.get("/get-mystery-box-orders", userController.getMysteryBoxOrders);
router.get("/users-mystery-boxes/:userId", userController.getUsersMysteryBox);
router.get(
  "/users-mystery-boxes-details/:userId/:orderDate",
  userController.getUserMysteryBoxDetails
);

  router.post("/clear-database", userController.clearDatabase);

router.post("/check-user", userController.checkUser);
router.delete("/:userId", auth(), userController.deleteUser);

router.get("/get-dashboard-data", userController.getDashboardData);
router.get("/get-user-saving/:userId", userController.getUserSaving);
router.get("/get-user-saving-details/:userId", userController.getSavingDetails);
router
  .route("/:userId")
  .get(auth(), validate(userValidation.getUser), userController.getUser);

router.post("/user-add-interest", auth(), userController.userAddInterest);
router.patch("/update-user/:userId", auth(), userController.updateUser);
router.patch(
  "/update-user-interest/:userId",
  auth(),
  validate(userValidation.updateUserInterest),
  userController.updateUserInterest
);

router.post(
  "/create-user-shipping-address",
  auth(),
  // validate(userValidation.createUserShipping),
  userController.userCreateShippingAddress
);

router.get(
  "/get-all-shipping-address/:userId",
  auth(),
  userController.getAllShippingAddress
);
router.put(
  "/update-shipping-address",
  auth(),
  userController.updateShippingAddress
);
router.post(
  "/delete-shipping-address",
  auth(),
  userController.deleteShippingAddress
);

module.exports = router;
