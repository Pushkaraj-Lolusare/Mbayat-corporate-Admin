const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    shippingAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserShippingAddress",
      default: null,
    },
    productPrice: {
      type: Number,
    },
    totalQuantity: {
      type: Number,
    },
    subTotal: {
      type: Number,
    },
    tax: {
      type: Number,
    },
    shippingCharge: {
      type: Number,
    },
    orderType: {
      type: String,
      enum: ["Individual", "As Gift", "Corporate"],
      default: "Individual",
    },
    orderStatus: {
      type: String,
      enum: ["delivered", "pending", "out for deliver", "packing"],
      default: "pending",
    },
    shippingStatus: {
      type: String,
      enum: ["Under Review", "Deliver"],
      default: "Under Review",
    },
    paymentStatus: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

const OrderModel = mongoose.model("Orders", orderSchema);

module.exports = OrderModel;
