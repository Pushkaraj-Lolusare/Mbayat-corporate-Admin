const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const productCategorySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    name: {
      type: String,
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

productCategorySchema.plugin(toJSON);
productCategorySchema.plugin(paginate);

const ProductCategoryModel = mongoose.model(
  "ProductCategory",
  productCategorySchema
);

module.exports = ProductCategoryModel;
