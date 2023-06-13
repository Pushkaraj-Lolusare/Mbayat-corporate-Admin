const express = require("express");
const {
  vendorHomeController,
} = require("../../../controllers");

const router = express.Router();

router.get("/vendor-home-data/:userId", vendorHomeController.getHomeData);
router.get("/get-all-vendors", vendorHomeController.getAllVendorLists);

module.exports = router;
