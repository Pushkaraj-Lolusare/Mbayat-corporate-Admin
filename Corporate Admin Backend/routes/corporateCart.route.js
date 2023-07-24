const express = require("express");
// const { check } = require("../middleware/check");
const CorporateCartModel = require("../model/corporateCart.model")
// const  CartModel = require("../model/cart.model");

const CorporateCartRouter = express.Router();

CorporateCartRouter.get("/", async (req, res) => {
    const userId = req.body.userId;
    try {
      const data = await CorporateCartModel.find({ userId: userId });
      res.send(data);
    } catch (error) {
      res.send(error);
    }
    
});

CorporateCartRouter.post("/", async (req, res) => {
    try {
        const data = new CorporateCartModel(req.body);
        await data.save();
        res.send({msg:"Added to Cart", data: data});
      } catch (error) {
        res.send(error);
      }
});

CorporateCartRouter.delete("/:id", async (req, res) => {
  const productId = req.params.id;
//   console.log("productid", productId);

  try {
    let cart = await CorporateCartModel.findOneAndDelete({ _id:productId });
    // console.log("cartid", cart);
    return res.status(201).send("Cart Item Deleted");
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

module.exports = CorporateCartRouter