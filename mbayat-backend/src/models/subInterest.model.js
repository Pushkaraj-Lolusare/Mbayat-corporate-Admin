const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const subInterestSchema = mongoose.Schema(
  {
    interestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interest",
    },
    name: {
      type: String,
      required: false,
      trim: true,
      unique: true,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

subInterestSchema.plugin(toJSON);
subInterestSchema.plugin(paginate);

subInterestSchema.statics.isNameTaken = async function (name) {
  const interest = await this.findOne({ name });
  return !!interest;
};

const SubInterestModel = mongoose.model("SubInterest", subInterestSchema);

module.exports = SubInterestModel;
