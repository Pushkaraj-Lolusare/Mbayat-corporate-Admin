const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const interestSchema = mongoose.Schema(
  {
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

interestSchema.plugin(toJSON);
interestSchema.plugin(paginate);

interestSchema.statics.isNameTaken = async function (name) {
  const interest = await this.findOne({ name });
  return !!interest;
};

const InterestModel = mongoose.model("Interest", interestSchema);

module.exports = InterestModel;
