const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { wishlistController } = require("../../controllers");
const { wishlistValidation } = require("../../validations");

const router = express.Router();

router.post(
  "/add-product-to-wishlist",
  auth(),
  validate(wishlistValidation.createWishlist),
  wishlistController.createWishlist
);
router.get(
  "/wishlist-by-user",
  auth(),
  validate(wishlistValidation.getWishlistByUser),
  wishlistController.getWishlistByUser
);
router.delete(
  "/remove-wishlist-product",
  auth(),
  validate(wishlistValidation.deleteWishlist),
  wishlistController.deleteWishlistById
);

module.exports = router;
