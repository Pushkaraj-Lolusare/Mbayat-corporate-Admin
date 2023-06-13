const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const MysteryBoxSettingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cutOfDate: {
      type: String,
    },
    autoRejectPeriod: {
      type: Number,
      default: null,
    },
    numberOfInterest: {
      type: Number,
      default: null,
    },
    subscriptionPerMonth: {
      type: Number,
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

MysteryBoxSettingSchema.plugin(toJSON);
MysteryBoxSettingSchema.plugin(paginate);

const MysteryBoxSettingModel = mongoose.model(
  "MysteryBoxSetting",
  MysteryBoxSettingSchema
);

module.exports = MysteryBoxSettingModel;
