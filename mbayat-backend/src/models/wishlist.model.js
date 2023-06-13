const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const wishlistSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.plugin(toJSON);
wishlistSchema.plugin(paginate);

const WishlistModel = mongoose.model("Wishlist", wishlistSchema);

module.exports = WishlistModel;
