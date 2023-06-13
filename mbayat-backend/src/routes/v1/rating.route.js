const express = require("express");
const auth = require("../../middlewares/auth");
const { ratingController } = require("../../controllers");
const validate = require("../../middlewares/validate");
const {
  addRatingValidation,
  getRatingByUserValidation,
  getRatingByProductValidation,
  editRatingValidation,
  deleteRatingValidation,
} = require("../../validations/rating.validate");

const router = express.Router();

router.post(
  "/add-review",
  auth(),
  validate(addRatingValidation),
  ratingController.addRatingToProduct
);
router.get(
  "/get-review-by-user/:userId",
  auth(),
  validate(getRatingByUserValidation),
  ratingController.getRatingByUser
);
router.get(
  "/get-review-by-product/:productId",
  auth(),
  validate(getRatingByProductValidation),
  ratingController.getRatingByProduct
);
router.get("/get-all-review-lists", auth(), ratingController.getAllRatingList);

router.put(
  "/edit-review",
  auth(),
  validate(editRatingValidation),
  ratingController.editRating
);
router.delete(
  "/delete-review",
  auth(),
  validate(deleteRatingValidation),
  ratingController.deleteRating
);

module.exports = router;
