const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const userShippingAddressSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    houseNo: {
      type: String,
      default: "",
    },
    apartment: {
      type: String,
      default: "",
    },
    floor: {
      type: String,
      default: "",
    },
    avenue: {
      type: String,
      default: "",
    },
    direction: {
      type: String,
      default: "",
    },
    street1: {
      type: String,
      default: "",
      require: true,
    },
    street2: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
      require: true,
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    pinCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userShippingAddressSchema.plugin(toJSON);
userShippingAddressSchema.plugin(paginate);

const UserShippingAddress = mongoose.model(
  "UserShippingAddress",
  userShippingAddressSchema
);

module.exports = UserShippingAddress;
