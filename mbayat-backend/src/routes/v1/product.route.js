const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const auth = require("../../middlewares/auth");
const { productController } = require("../../controllers");
const { productValidation } = require("../../validations");
const validate = require("../../middlewares/validate");

const s3 = require("../../config/awsConfig");

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

const router = express.Router();

router.post(
  "/create-product",
  auth(),
  upload.array("images"),
  validate(productValidation.createProduct),
  productController.createProduct
);

router.get(
  "/product-by-vendor/:userId",
  auth(),
  productController.getProductByVendor
);

router.post(
  "/edit-product",
  auth(),
  upload.array("images"),
  validate(productValidation.editProduct),
  productController.editProduct
);
router.post(
  "/delete-product",
  auth(),
  validate(productValidation.deleteProduct),
  productController.deleteProduct
);

// product category routes
router.post(
  "/create-product-category",
  auth(),
  validate(productValidation.createProductCategory),
  productController.createProductCategory
);
router.get(
  "/product-category-list/:userId",
  auth(),
  productController.getProductCategory
);
router.put(
  "/edit-product-category",
  auth(),
  validate(productValidation.editProductCategory),
  productController.editProductCategory
);
router.post(
  "/delete-product-category",
  auth(),
  validate(productValidation.deleteProductCategory),
  productController.deleteProductCategory
);

// product sub category routes
router.post(
  "/create-product-sub-category",
  auth(),
  validate(productValidation.createProductSubCategory),
  productController.createProductSubCategory
);
router.get(
  "/product-sub-category-list/:categoryId",
  auth(),
  productController.getProductSubCategory
);

router.get(
  "/product-sub-category-by-vendor/:vendorId",
  auth(),
  productController.getProductSubCategoryByVendor
);

router.put(
  "/edit-product-sub-category",
  auth(),
  validate(productValidation.editProductSubCategory),
  productController.editProductSubCategory
);
router.post(
  "/delete-product-sub-category",
  auth(),
  validate(productValidation.deleteProductSubCategory),
  productController.deleteProductSubCategory
);

router.get(
  "/product-details/:productId",
  auth(),
  productController.getProductDetails
);

module.exports = router;
