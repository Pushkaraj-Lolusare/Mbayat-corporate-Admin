const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const skiipedMonthSchema = mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    month: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

skiipedMonthSchema.plugin(toJSON);
skiipedMonthSchema.plugin(paginate);

const SkippedMonths = mongoose.model("SkippedMonth", skiipedMonthSchema);

module.exports = SkippedMonths;
