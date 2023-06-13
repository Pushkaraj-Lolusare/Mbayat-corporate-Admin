const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { adminUserValidation } = require("../../validations");
const { adminUserController } = require("../../controllers");

const router = express.Router();

router.get("/admin-user-list", auth(), adminUserController.adminUserLists);
router.post(
  "/add-admin-user",
  auth(),
  validate(adminUserValidation.createAdminUser),
  adminUserController.addAdminUser
);
router.post(
  "/edit-admin-user",
  auth(),
  validate(adminUserValidation.editAdminUser),
  adminUserController.editAdminUser
);
router.delete(
  "/delete-admin-user",
  auth(),
  adminUserController.deleteAdminUser
);

module.exports = router;
