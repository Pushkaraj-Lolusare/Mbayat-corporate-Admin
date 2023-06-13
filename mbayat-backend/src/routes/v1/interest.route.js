const express = require("express");
const auth = require("../../middlewares/auth");
const { interestController } = require("../../controllers");

const router = express.Router();

router.post("/create-interest", auth(), interestController.createInterest);
router.get("/interest-lists", interestController.getListOfInterest);
router.put("/update-interest", auth(), interestController.updateInterest);
router.delete("/delete-interest", auth(), interestController.removeInterest);
router.get(
  "/get-user-by-interest/:interestId",
  auth(),
  interestController.userByInterest
);

router.post(
  "/create-sub-interest",
  auth(),
  interestController.createSubInterest
);
router.get(
  "/sub-interest-by-id/:interestId",
  interestController.getSubInterestById
);

module.exports = router;
