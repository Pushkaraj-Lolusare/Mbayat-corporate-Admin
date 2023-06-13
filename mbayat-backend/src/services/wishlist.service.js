const { Wishlist } = require("../models");

const createWishlist = async (reqBody) => {
  const checkWishlist = await Wishlist.findOne(reqBody);
  if (checkWishlist) {
    return {
      status: "failed",
      message: "This product is already in wishlist.",
    };
  }

  const create = await Wishlist.create(reqBody)
    .then((res) => {
      if (res) {
        return {
          status: "success",
          message: "Product add to wishlist successfully.",
        };
      }
      return {
        status: "failed",
        message: "Product add to wishlist failed.",
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err.message,
      };
    });

  return create;
};

const getWishlistByUser = async (userId) => {
  const getWishlist = await Wishlist.find({ userId }).populate('productId')
    .then((res) => {
      if (res) {
        return {
          status: "success",
          message: "All wishlist items",
          data: res
        };
      }
      return {
        status: "failed",
        message: "You haven't added any product to wishlist.",
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err.message,
      };
    });

  return getWishlist;
};

const deleteWishlist = async (wishlistId) => {
  const remove = await Wishlist.deleteOne({ _id: wishlistId });
  if (remove) {
    return {
      status: "success",
      message: "Product removed from wishlist successfully.",
    };
  }

  return {
    status: "failed",
    message: "Something went wrong while removing Product from wishlist.",
  };
};

module.exports = {
  createWishlist,
  getWishlistByUser,
  deleteWishlist,
};
