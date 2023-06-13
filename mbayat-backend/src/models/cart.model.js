const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.plugin(toJSON);
cartSchema.plugin(paginate);

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;
