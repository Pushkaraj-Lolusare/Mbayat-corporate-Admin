const express = require("express");
const auth = require("../../middlewares/auth");
const { cartController } = require("../../controllers");

const router = express.Router();

router.post("/add-to-cart", cartController.addToCart);
router.get("/get-cart-by-user/:userId", cartController.getCartByUser);
router.put("/update-cart", cartController.updateCart);
router.delete("/delete-cart", cartController.deleteCart);

module.exports = router;
