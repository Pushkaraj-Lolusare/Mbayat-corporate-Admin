const moment = require("moment");
const { Cart } = require("../models");

const addToCart = async (reqBody) => {
  const { userId, productId } = reqBody;

  const checkCart = await Cart.findOne({
    userId,
    productId,
  }).then((res) => {
    return res;
  });

  if (checkCart) {
    return {
      status: "failed",
      message:
        "Item is already exist in cart, Please update the quantity of item.",
    };
  }

  const createCart = await Cart.create(reqBody).then((res) => {
    return res;
  });

  if (createCart) {
    return {
      status: "success",
      message: "Item added to cart successfully.",
    };
  }

  return {
    status: "failed",
    message:
      "Something is wrong while adding item to cart, Please try again or later.",
  };
};

const getCartByUser = async (userId) => {
  const findCart = await Cart.find({ userId })
    .populate("productId")
    .then((res) => {
      return res;
    });

  if (findCart) {
    return {
      status: "success",
      message: "Item fetched for cart successfully.",
      data: findCart,
    };
  }

  return {
    status: "failed",
    message:
      "Something is wrong while getting item for cart, Please try again or later.",
  };
};

const updateCart = async (reqBody) => {
  const { cartId, quantity } = reqBody;

  const checkCart = await Cart.findOne({
    _id: cartId,
  }).then((res) => {
    return res;
  });

  if (checkCart) {
    const update = await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        quantity,
      }
    ).then((res) => {
      return res;
    });

    if (update) {
      return {
        status: "success",
        message: "Cart updated successfully.",
      };
    }

    return {
      status: "failed",
      message:
        "Something went wrong while updating cart, Please try again or later.",
    };
  }
  return {
    status: "failed",
    message: "Cart not found, Please try again or later.",
  };
};

const deleteCart = async (reqBody) => {
  const { cartId } = reqBody;

  const checkCart = await Cart.findOne({
    _id: cartId,
  }).then((res) => {
    return res;
  });

  if (checkCart) {
    const remove = await Cart.deleteOne({
      _id: cartId,
    }).then((res) => {
      return res;
    });

    if (remove) {
      return {
        status: "success",
        message: "Cart Item removed successfully.",
      };
    }

    return {
      status: "failed",
      message:
        "Something went wrong while removing cart item, Please try again or later.",
    };
  }
  return {
    status: "failed",
    message: "Cart not found, Please try again or later.",
  };
};

module.exports = {
  addToCart,
  getCartByUser,
  updateCart,
  deleteCart,
};
