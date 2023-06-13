const Joi = require("joi");

const createProduct = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    barcode: Joi.string().optional().allow(null, ""),
    sellingPrice: Joi.any().required(),
    corporatePrice: Joi.any().required(),
    totalQuantity: Joi.any().required(),
    minB2BOrder: Joi.any().required(),
    category: Joi.string().required(),
    subCategory: Joi.string().required().allow(null, ""),
    img: Joi.string().optional().allow(null, ""),
    images: Joi.string().optional().allow(null, ""),
  }),
};

const editProduct = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
    userId: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    barcode: Joi.string().optional().allow(null, ""),
    sellingPrice: Joi.any().required(),
    corporatePrice: Joi.any().required(),
    totalQuantity: Joi.any().required(),
    minB2BOrder: Joi.any().required(),
    category: Joi.string().required(),
    subCategory: Joi.string().required(),
    img: Joi.string().optional().allow(null, ""),
    removedImage: Joi.string().optional().allow(null, ""),
    status: Joi.string().optional().allow(null, ""),
  }),
};

const deleteProduct = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
    userId: Joi.string().required(),
  }),
};

const createProductCategory = {
  body: Joi.object().keys({
    categoryName: Joi.string().required(),
    userId: Joi.string().required(),
  }),
};

const editProductCategory = {
  body: Joi.object().keys({
    categoryName: Joi.string().required(),
    userId: Joi.string().required(),
    productCategoryId: Joi.string().required(),
  }),
};

const deleteProductCategory = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    productCategoryId: Joi.string().required(),
  }),
};

const createProductSubCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    userId: Joi.string().required(),
    productCategoryId: Joi.string().required(),
  }),
};

const editProductSubCategory = {
  body: Joi.object().keys({
    productCategoryId: Joi.string().required(),
    userId: Joi.string().required(),
    name: Joi.string().required(),
    subCategoryId: Joi.string().required(),
  }),
};

const deleteProductSubCategory = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    subCategoryId: Joi.string().required(),
  }),
};

module.exports = {
  createProduct,
  editProduct,
  deleteProduct,
  createProductCategory,
  editProductCategory,
  deleteProductCategory,
  createProductSubCategory,
  editProductSubCategory,
  deleteProductSubCategory,
};
