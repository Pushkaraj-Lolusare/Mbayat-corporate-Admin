const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const validate = require("../../../middlewares/validate");
const {
  vendorUserController,
  authController,
} = require("../../../controllers");
const { vendorUserValidation } = require("../../../validations");

const s3 = require("../../../config/awsConfig");

const router = express.Router();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: "mbaytkwtapp",
    acl: "public-read", // make the uploaded image publicly accessible
    metadata(req, file, cb) {
      cb(null, {
        "Cache-Control": "max-age=31536000",
      });
    },
    key(req, file, cb) {
      cb(null, `productImages/${Date.now().toString()}-${file.originalname}`);
    },
  }),
});

router.post(
  "/register-vendor",
  upload.single("companyLogo"),
  validate(vendorUserValidation.createVendorUser),
  vendorUserController.registerVendor
);

router.post(
  "/vendor-login",
  validate(vendorUserValidation.loginVendor),
  vendorUserController.loginVendor
);

router.post(
  "/vendor-forgot-password",
  validate(vendorUserValidation.forgotPassword),
  authController.forgotPassword
);

router.post(
  "/vendor-reset-password",
  validate(vendorUserValidation.resetPassword),
  authController.resetPassword
);

router.post("/remove-vendor", vendorUserController.removeVendor);

router.get(
  "/get-vendor-details/:vendorId",
  vendorUserController.getVendorDetails
);
router.post(
  "/update-vendor-details",
  upload.single("companyLogo"),
  vendorUserController.updateVendor
);
router.post("/skip-this-month", vendorUserController.skipThisMonth);
router.post("/un-skip-this-month", vendorUserController.unSkipThisMonth);

module.exports = router;
