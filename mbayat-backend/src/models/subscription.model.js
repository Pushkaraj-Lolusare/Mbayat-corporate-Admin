const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const subscriptionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    interestIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Interest" }],
      default: null,
    },
    paymentMethodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
      default: null,
    },
    shippingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserShippingAddress",
      default: null,
    },
    subscriptionType: {
      type: String,
      enum: ["Monthly", "Yearly"],
      default: null,
    },
    totalMonths: {
      type: Number,
      default: 0,
    },
    totalPaidAmount: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    pauseUntil:{
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["upcoming", "running", "expired", "pause"],
      default: "running",
    },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.plugin(toJSON);
subscriptionSchema.plugin(paginate);

const SubscriptionModel = mongoose.model("Subscription", subscriptionSchema);

module.exports = SubscriptionModel;
