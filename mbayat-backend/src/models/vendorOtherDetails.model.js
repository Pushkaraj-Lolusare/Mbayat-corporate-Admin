const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const vendorOtherDetailsSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    companyName: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    postalCode: {
      type: String,
      default: null,
    },
    serviceFor: {
      type: String,
      default: null,
    },
    companyLogo: {
      type: String,
      default: null,
    },
    websiteLink: {
      type: String,
      default: null,
    },
    instagramLink: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

vendorOtherDetailsSchema.plugin(toJSON);
vendorOtherDetailsSchema.plugin(paginate);

const VendorOtherDetailsModel = mongoose.model(
  "VendorOtherDetails",
  vendorOtherDetailsSchema
);

module.exports = VendorOtherDetailsModel;
