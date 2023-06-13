const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const productSubCategorySchema = mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
    },
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

productSubCategorySchema.plugin(toJSON);
productSubCategorySchema.plugin(paginate);

const ProductSubCategoryModel = mongoose.model(
  "ProductSubCategory",
  productSubCategorySchema
);

module.exports = ProductSubCategoryModel;
