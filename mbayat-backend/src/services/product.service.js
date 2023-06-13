const {
  Products,
  ProductCategory,
  ProductSubCategory,
  Rating,
} = require("../models");
const { userService } = require("./index");

const s3 = require('../config/awsConfig');

const createProduct = async (userBody) => {
  // Read the file from disk

  const reqBody = userBody.body;
  const images = userBody.files;
  let storedImages = [];
  if(images !== undefined && images.length > 0){
    for(let i = 0; i < images.length; i++){
      storedImages.push(images[i].location);
    }
  }

  const addProduct = await Products.create({...reqBody, productImages: storedImages});
  if (addProduct) {
    return {
      status: "success",
      message: "Product added to product successfully.",
    };
  }
  return {
    status: "failed",
    message:
      "Something went wrong while adding product, Please try again or later.",
  };
};

const getProductByVendor = async (filter, options) => {
  const { userId } = filter;
  const getUser = await userService.getUserById(userId);
  if (!getUser) {
    return {
      status: "failed",
      message: "User is Incorrect.",
    };
  }
  let getProducts = [];
  if (options.fetchType === "all") {
    getProducts = await Products.find({
      userId,
      is_deleted: false,
    })
      .populate("category")
      .then((res) => {
        return res;
      });
  } else {
    getProducts = await Products.paginate(filter, options);
  }
  return {
    status: "success",
    message: "Your added all product list.",
    data: getProducts,
  };
};


const editProduct = async (userBody) => {
  let { userId, productId } = userBody.body;
  let removedImage = userBody.body?.removedImage;
  const reqBody = userBody.body;

  const checkProduct = await Products.findOne({ userId, _id: productId }).then(
    (res) => {
      return res;
    }
  );
  if (checkProduct) {

    if(removedImage !== undefined){
      finalRemoveImages = removedImage.split(',');
      finalRemoveImages.forEach(image => {

        const params = {
          Bucket: process.env.AWS_BUCKET,
          Key: 'productImages/' + image,
        };

        s3.deleteObject(params, function (err, data) {
          if (err) {
            console.log('Error deleting image:', err);
          } else {
            console.log('Image deleted successfully:', data);
          }
        });
      });

      let tempImages = checkProduct.productImages;
      tempImages.filter((images) => !finalRemoveImages.includes(images));
      checkProduct.productImages = tempImages;
    }

    const images = userBody.files;
    let storedImages = checkProduct.productImages;
    if(images !== undefined && images.length > 0){
      for(let i = 0; i < images.length; i++){
        storedImages.push(images[i].location);
      }
    }

    const updateProduct = await Products.updateOne(
      { _id: productId },
      {
        name: reqBody.name,
        description: reqBody.description,
        barcode: reqBody.barcode,
        sellingPrice: reqBody.sellingPrice,
        corporatePrice: reqBody.corporatePrice,
        totalQuantity: reqBody.totalQuantity,
        minB2BOrder: reqBody.minB2BOrder,
        category: reqBody.category,
        subCategory: reqBody.subCategory,
        productImages: storedImages,
        status: reqBody.status ? reqBody.status : "active",
      }
    )
      .then((res) => {
        if (res) {
          return {
            status: "success",
            message: "Product updated successfully.",
          };
        }
        return {
          status: "failed",
          message:
            "Failed to update product details, Please try again or later.",
        };
      })
      .catch((err) => {
        return {
          status: "failed",
          message: err.message,
        };
      });
    return updateProduct;
  }
  return {
    status: "failed",
    message: "Product not found.",
  };
};

const deleteProduct = async (reqBody) => {
  const { userId, productId } = reqBody;
  const checkProduct = await Products.findOne({ userId, _id: productId }).then(
    (res) => {
      return res;
    }
  );
  if (checkProduct) {
    const removeProduct = await Products.updateOne(
      {
        _id: productId,
        userId,
      },
      {
        is_deleted: true,
      }
    )
      .then((res) => {
        if (res) {
          return {
            status: "success",
            message: "Product removed successfully.",
          };
        }
        return {
          status: "failed",
          message:
            "Something went wrong while removing Product, Please try again or later.",
        };
      })
      .catch((err) => {
        return {
          status: "error",
          message: err.message,
        };
      });

    return removeProduct;
  }
  return {
    status: "failed",
    message: "Product not found.",
  };
};

//  product category section

const createProductCategory = async (reqBody) => {
  const { userId, categoryName } = reqBody;
  const checkCategory = await ProductCategory.findOne({
    userId,
    name: categoryName,
  }).then((res) => {
    return res;
  });

  if (checkCategory) {
    return {
      status: "failed",
      message: "Category name already exist.",
    };
  }

  const createCategory = await ProductCategory.create({
    userId,
    name: categoryName,
  });
  if (createCategory) {
    return {
      status: "success",
      message: "Product Category created successfully.",
    };
  }
  return {
    status: "failed",
    message:
      "Something went wrong while adding Product Category, Please try again or later.",
  };
};

const getProductCategory = async (filter, options) => {
  const { userId } = filter;
  const getUser = await userService.getUserById(userId);
  if (!getUser) {
    return {
      status: "failed",
      message: "User is Incorrect.",
    };
  }
  let getProducts = [];
  if (options.fetchType === "all") {
    getProducts = await ProductCategory.find({
      userId,
    }).then((res) => {
      return res;
    });
  } else {
    getProducts = await ProductCategory.paginate(filter, options);
  }
  return {
    status: "success",
    message: "Your added all product category list.",
    data: getProducts,
  };
};

const editProductCategory = async (reqBody) => {
  const { userId, productCategoryId, categoryName } = reqBody;
  const checkProductCategory = await ProductCategory.findOne({
    _id: productCategoryId,
    userId,
  }).then((res) => {
    return res;
  });
  if (checkProductCategory) {
    const updateProductCat = await ProductCategory.updateOne(
      {
        _id: productCategoryId,
      },
      {
        name: categoryName,
      }
    )
      .then((res) => {
        if (res) {
          return {
            status: "success",
            message: "Product Category update successfully.",
          };
        }
        return {
          status: "failed",
          message: "Something went wrong while updating product category.",
        };
      })
      .catch((err) => {
        return {
          status: "error",
          message: err.message,
        };
      });

    return updateProductCat;
  }
  return {
    status: "failed",
    message: "Product Category not found.",
  };
};

const deleteProductCategory = async (reqBody) => {
  const { userId, productCategoryId } = reqBody;
  const checkProductCategory = await ProductCategory.findOne({
    _id: productCategoryId,
    userId,
  }).then((res) => {
    return res;
  });
  if (checkProductCategory) {
    const removeCat = await ProductCategory.updateOne(
      {
        _id: productCategoryId,
      },
      {
        status: "in active",
      }
    )
      .then((res) => {
        if (res) {
          return {
            status: "success",
            message: "Product category removed successfully.",
          };
        }
        return {
          status: "failed",
          message: "Something went wrong while removing category.",
        };
      })
      .catch((err) => {
        return {
          status: "error",
          message: err.message,
        };
      });
    return removeCat;
  }
  return {
    status: "failed",
    message: "Product Category not found.",
  };
};

//  product sub category section

const createProductSubCategory = async (reqBody) => {
  const { userId, productCategoryId, name } = reqBody;
  const checkCategory = await ProductSubCategory.findOne({
    categoryId: productCategoryId,
    userId,
    name,
  }).then((res) => {
    return res;
  });

  if (checkCategory) {
    return {
      status: "failed",
      message: "Category name already exist.",
    };
  }

  const createCategory = await ProductSubCategory.create({
    categoryId: productCategoryId,
    userId,
    name,
  });
  if (createCategory) {
    return {
      status: "success",
      message: "Product Sub Category created successfully.",
    };
  }
  return {
    status: "failed",
    message:
      "Something went wrong while adding Product Sub Category, Please try again or later.",
  };
};

const getProductSubCategory = async (filter, options) => {
  let getProducts = [];
  if (options.fetchType === "all") {
    getProducts = await ProductSubCategory.find({
      categoryId: filter.categoryId,
    }).then((res) => {
      return res;
    });
  } else {
    getProducts = await ProductSubCategory.paginate(filter, options);
  }
  return {
    status: "success",
    message: "Product sub category list.",
    data: getProducts,
  };
};

const getProductSubCategoryByVendor = async (userId) => {
  const getProducts = await ProductSubCategory.find({
    userId,
  })
    .populate("categoryId")
    .then((res) => {
      return res;
    });
  return {
    status: "success",
    message: "Product sub category list.",
    data: getProducts,
  };
};

const editProductSubCategory = async (reqBody) => {
  const { userId, productCategoryId, name, subCategoryId } = reqBody;
  const checkProductCategory = await ProductSubCategory.findOne({
    _id: subCategoryId,
    userId,
  }).then((res) => {
    return res;
  });
  if (checkProductCategory) {
    const updateProductCat = await ProductSubCategory.updateOne(
      {
        _id: subCategoryId,
      },
      {
        name,
        categoryId: productCategoryId,
      }
    )
      .then((res) => {
        if (res) {
          return {
            status: "success",
            message: "Product Sub Category update successfully.",
          };
        }
        return {
          status: "failed",
          message: "Something went wrong while updating product sub category.",
        };
      })
      .catch((err) => {
        return {
          status: "error",
          message: err.message,
        };
      });

    return updateProductCat;
  }
  return {
    status: "failed",
    message: "Product Sub Category not found.",
  };
};

const deleteProductSubCategory = async (reqBody) => {
  const { userId, subCategoryId } = reqBody;
  const checkProductCategory = await ProductSubCategory.findOne({
    _id: subCategoryId,
    userId,
  }).then((res) => {
    return res;
  });
  if (checkProductCategory) {
    const removeCat = await ProductSubCategory.updateOne(
      {
        _id: subCategoryId,
      },
      {
        status: "in active",
      }
    )
      .then((res) => {
        if (res) {
          return {
            status: "success",
            message: "Product Sub category removed successfully.",
          };
        }
        return {
          status: "failed",
          message: "Something went wrong while removing sub category.",
        };
      })
      .catch((err) => {
        return {
          status: "error",
          message: err.message,
        };
      });
    return removeCat;
  }
  return {
    status: "failed",
    message: "Product Sub Category not found.",
  };
};

const getProductDetails = async (productId) => {
  const getProduct = await Products.findOne({
    _id: productId,
  }).then((res) => {
    return res;
  });

  if (getProduct) {
    let rating = [];
    let avgRating = 0;
    const getRating = await Rating.find({ productId })
      .populate("userId")
      .then((res) => {
        return res;
      });

    if (getRating.length > 0) {
      getRating.map((data) => {
        avgRating += data.rating;
        return data;
      });
      rating = getRating;
      avgRating /= getRating.length;
    }

    const response = { ...getProduct.toJSON(), ...{ rating, avgRating } };
    return {
      status: "success",
      message: "Product Details",
      data: response,
    };
  }

  return {
    status: "failed",
    message: "Product Details not found",
  };
};

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
