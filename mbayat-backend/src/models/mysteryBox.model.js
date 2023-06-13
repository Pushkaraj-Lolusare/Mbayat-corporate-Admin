const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const mysteryBoxSchema = mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    interestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interest",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderDate: {
      type: String,
    },
    price: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

mysteryBoxSchema.plugin(toJSON);
mysteryBoxSchema.plugin(paginate);

const MysteryBoxModel = mongoose.model("MysteryBox", mysteryBoxSchema);

module.exports = MysteryBoxModel;
