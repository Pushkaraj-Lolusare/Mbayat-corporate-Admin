const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

// No use for now
const orderItemSchema = mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendors",
    },
    productPrice: {
      type: Number,
    },
    orderQty: {
      type: Number,
    },
    orderItemDiscount: {
      type: Number,
    },
    orderItemSubTotal: {
      type: Number,
    },
    giveAsGift: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
  },
  {
    timestamps: true,
  }
);

orderItemSchema.plugin(toJSON);
orderItemSchema.plugin(paginate);

const OrderItemsModel = mongoose.model("OrderItems", orderItemSchema);

module.exports = OrderItemsModel;
