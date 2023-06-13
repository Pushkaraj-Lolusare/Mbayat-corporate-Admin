const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const productSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    productImages: {
      type: Array,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    barcode: {
      type: String,
    },
    sellingPrice: {
      type: Number,
    },
    corporatePrice: {
      type: Number,
    },
    totalQuantity: {
      type: Number,
    },
    minB2BOrder: {
      type: Number,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interest",
      default: null,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interest",
      required: false,
    },
    status: {
      type: String,
      default: "active",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(toJSON);
productSchema.plugin(paginate);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
