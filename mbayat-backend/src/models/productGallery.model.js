const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const productGallerySchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    imageUrl: {
      type: String,
    },
    isMainImage: {
      type: Boolean,
      default: false,
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

productGallerySchema.plugin(toJSON);
productGallerySchema.plugin(paginate);

const ProductGalleryModel = mongoose.model(
  "ProductGallery",
  productGallerySchema
);

module.exports = ProductGalleryModel;
