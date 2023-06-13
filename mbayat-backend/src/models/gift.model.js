const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const giftSchema = mongoose.Schema(
  {
    giftSenderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    giftReceiverUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    giftType: {
      type: String,
      enum: ["Subscription", "Box"],
      default: null,
    },
    giftSubscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    giftBoxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MysteryBox",
      default: null,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    totalMonths: {
      type: Number,
      default: null,
    },
    totalAmount: {
      type: Number,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "pending", "delivered", "expired"],
      default: "pending",
    },
    sentType: {
      type: String,
      enum: ["individual", "corporate"],
      default: "individual",
    },
  },
  {
    timestamps: true,
  }
);

giftSchema.plugin(toJSON);
giftSchema.plugin(paginate);

const giftModel = mongoose.model("Gift", giftSchema);

module.exports = giftModel;
