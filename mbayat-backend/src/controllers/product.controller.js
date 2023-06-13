const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { productService } = require("../services");
const pick = require("../utils/pick");

const createProduct = catchAsync(async (req, res) => {
  const create = await productService.createProduct(req);
  res.status(httpStatus.OK).json(create);
});

const getProductByVendor = catchAsync(async (req, res) => {
  const filter = pick({ userId: req.params.userId, status: "active" }, [
    "userId",
    "status",
  ]);
  const options = pick(req.query, ["sortBy", "limit", "page", "fetchType"]);
  const result = await productService.getProductByVendor(filter, options);
  res.status(httpStatus.OK).send(result);
});

const editProduct = catchAsync(async (req, res) => {
  const edit = await productService.editProduct(req);
  res.status(httpStatus.OK).json(edit);
});

const deleteProduct = catchAsync(async (req, res) => {
  const remove = await productService.deleteProduct(req.body);
  res.status(httpStatus.OK).json(remove);
});

const createProductCategory = catchAsync(async (req, res) => {
  const add = await productService.createProductCategory(req.body);
  res.status(httpStatus.OK).json(add);
});

const getProductCategory = catchAsync(async (req, res) => {
  const filter = pick({ userId: req.params.userId, status: "active" }, [
    "userId",
    "status",
  ]);
  const options = pick(req.query, ["sortBy", "limit", "page", "fetchType"]);
  const result = await productService.getProductCategory(filter, options);
  res.status(httpStatus.OK).send(result);
});

const editProductCategory = catchAsync(async (req, res) => {
  const edit = await productService.editProductCategory(req.body);
  res.status(httpStatus.OK).json(edit);
});

const deleteProductCategory = catchAsync(async (req, res) => {
  const remove = await productService.deleteProductCategory(req.body);
  res.status(httpStatus.OK).json(remove);
});

const createProductSubCategory = catchAsync(async (req, res) => {
  const add = await productService.createProductSubCategory(req.body);
  res.status(httpStatus.OK).json(add);
});

const getProductSubCategory = catchAsync(async (req, res) => {
  const filter = pick({ categoryId: req.params.categoryId, status: "active" }, [
    "userId",
    "status",
    "categoryId",
  ]);
  const options = pick(req.query, ["sortBy", "limit", "page", "fetchType"]);
  const result = await productService.getProductSubCategory(filter, options);
  res.status(httpStatus.OK).send(result);
});

const getProductSubCategoryByVendor = catchAsync(async (req, res) => {
  const get = await productService.getProductSubCategoryByVendor(req.params.vendorId);
  res.status(httpStatus.OK).json(get);
});

const editProductSubCategory = catchAsync(async (req, res) => {
  const edit = await productService.editProductSubCategory(req.body);
  res.status(httpStatus.OK).json(edit);
});

const deleteProductSubCategory = catchAsync(async (req, res) => {
  const remove = await productService.deleteProductSubCategory(req.body);
  res.status(httpStatus.OK).json(remove);
});

const getProductDetails = catchAsync(async (req, res) => {
  const productDetails = await productService.getProductDetails(
    req.params.productId
  );
  res.status(httpStatus.OK).json(productDetails);
});

module.exports = {
  createProduct,
  getProductByVendor,
  editProduct,
  deleteProduct,
  createProductCategory,
  getProductCategory,
  editProductCategory,
  deleteProductCategory,
  createProductSubCategory,
  getProductSubCategory,
  editProductSubCategory,
  deleteProductSubCategory,
  getProductSubCategoryByVendor,
  getProductDetails,
};
