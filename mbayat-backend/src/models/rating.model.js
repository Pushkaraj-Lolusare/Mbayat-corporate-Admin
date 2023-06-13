const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const ratingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    rating: {
      type: Number,
      default: 0,
    },
    review: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "in_active"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

ratingSchema.plugin(toJSON);
ratingSchema.plugin(paginate);

const RatingModel = mongoose.model("Rating", ratingSchema);

module.exports = RatingModel;
