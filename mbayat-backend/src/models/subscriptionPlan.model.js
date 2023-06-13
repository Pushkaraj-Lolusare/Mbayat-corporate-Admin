const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const subscriptionPlanSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    planName: {
      type: String,
      default: null,
    },
    planPrice: {
      type: Number,
      default: null,
    },
    planDuration: {
      type: Number,
      default: 0,
    },
    planType: {
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

subscriptionPlanSchema.plugin(toJSON);
subscriptionPlanSchema.plugin(paginate);

const SubscriptionPlan = mongoose.model(
  "SubscriptionPlans",
  subscriptionPlanSchema
);

module.exports = SubscriptionPlan;
