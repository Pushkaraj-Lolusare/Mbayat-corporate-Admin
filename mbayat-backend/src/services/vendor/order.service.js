const moment = require("moment");
const { Orders, Rating, MySteryBox, Notification } = require("../../models");

const orderByVendor = async (vendorId, reqParam) => {
  const { orderStatus, orderType } = reqParam;

  let query = { vendorId };
  if (orderStatus) {
    query = {
      ...query,
      orderStatus,
    };
  }

  if (orderType) {
    query = {
      ...query,
      orderType,
    };
  }

  const getOrders = Orders.find(query)
    .populate(["vendorId", "userId", "productId", "shippingAddressId"])
    .then((res) => {
      return {
        status: "success",
        message: "Your all order list",
        data: res,
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err.message,
      };
    });
  if (getOrders) {
    return getOrders;
  }
  return {
    status: "failed",
    message: "You haven't any order Yet.",
  };
};

const updateOrderStatus = async (reqBody) => {
  const { vendorId, orderId, status } = reqBody;
  const orderUpdate = await Orders.updateOne(
    {
      _id: orderId,
      vendorId,
    },
    {
      orderStatus: status,
    }
  )
    .then((res) => {
      if (res) {
        return {
          status: "success",
          message: "Order updated successfully.",
        };
      }

      return {
        status: "failed",
        message:
          "Something went wrong while updating order, Please try again or later.",
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err.message,
      };
    });

  return orderUpdate;
};

const orderDetailsByVendor = async (orderId) => {
  const getOrder = await Orders.findOne({
    _id: orderId,
  })
    .populate(["vendorId", "userId", "productId", "shippingAddressId"])
    .then((res) => {
      return {
        status: "success",
        message: "Your order details.",
        data: res,
      };
    })
    .catch((err) => {
      return {
        status: "failed",
        message: err.message,
      };
    });

  return getOrder;
};

const getProductReviewByOrders = async (vendorId) => {
  const getReviews = await Rating.find({
    vendorId,
  })
    .populate(["userId", "productId"])
    .then((res) => {
      return res;
    });

  // if (getProducts.length > 0) {
  //   const finalProducts = [];
  //   for (let i = 0; i < getProducts.length; i += 1) {
  //     const { productId } = getProducts[i];
  //     const products = getProducts[i];
  //     const getReview = await Rating.find({
  //       productId,
  //     }).then((res) => {
  //       return res;
  //     });
  //
  //     finalProducts.push({ ...products.toJSON(), ...{ rating: getReview } });
  //   }
  //
  //   return {
  //     status: "success",
  //     message: "Your product with review",
  //     data: finalProducts,
  //   };
  // }

  return {
    status: "success",
    message: "All Product reviews",
    data: getReviews,
  };
};

const createMysteryBox = async (reqBody) => {
  const { userId, productId, orderDate } = reqBody;

  const checkBox = await MySteryBox.findOne({
    userId,
    productId,
    orderDate,
  }).then((res) => {
    return res;
  });

  if (checkBox) {
    return {
      status: "failed",
      message: "You already add prodcut to this user.",
    };
  }

  const createBox = await MySteryBox.create(reqBody)
    .then((res) => {
      if (res) {
        return {
          status: "success",
          message: "Mystery Box added successfully.",
        };
      }
      return {
        status: "failed",
        message:
          "Something went wrong while creating mystery box, Please try again or later.",
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err.message,
      };
    });

  if (createBox) {
    await Notification.create({
      userId,
      notification:
        "Exciting! You have just received a Mystery Box. Get ready for an adventure of surprises!, Thank you for being part of Mbayat. Enjoy unraveling the mysteries inside your Mystery Box!",
    });
  }

  return createBox;
};

const geHistoryOfMysteryBox = async (reqBody) => {
  const { vendorId } = reqBody;

  const getMysteryBox = await MySteryBox.find({
    vendorId,
  }).then((res) => {
    return res;
  });

  let responseArray = [];
  if (getMysteryBox.length > 0) {
    const allBoxes = [];
    getMysteryBox.map((box) => {
      allBoxes.push(box.orderDate);
      return box;
    });

    const result = allBoxes.reduce((acc, date) => {
      if (!acc[date]) {
        acc[date] = 1;
      } else {
        acc[date] += 1;
      }
      return acc;
    }, {});

    const output = Object.keys(result).map((date) => {
      return {
        date,
        count: result[date],
      };
    });

    responseArray = output.map((data) => {
      let status = "";

      for (let i = 0; i < getMysteryBox.length; i += 1) {
        const box = getMysteryBox[i];
        if (data.date === box.orderDate) {
          status = box.status;
        }
      }

      return { ...data, status };
    });

    responseArray.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  return {
    status: "success",
    message: "All mystery box orders",
    data: responseArray,
  };
};

const getMysteryBoxByDate = async (reqBody) => {
  const { vendorId, date } = reqBody;

  const dateStr = date;
  const newDate = moment(dateStr);

  // Last day of previous month
  const lastDayOfPrevMonth = newDate
    .clone()
    .subtract(1, "months")
    .endOf("month")
    .format("Y-MM-DD");

  // First day of next month
  const firstDayOfNextMonth = newDate
    .clone()
    .add(1, "months")
    .startOf("month")
    .format("Y-MM-DD");

  const findBoxes = await MySteryBox.find({
    vendorId,
    orderDate: {
      $gte: lastDayOfPrevMonth,
      $lt: firstDayOfNextMonth,
    },
  })
    .populate(["userId", "productId"])
    .then((res) => {
      return res;
    });

  return {
    status: "success",
    message: "All mystery box orders by date",
    data: findBoxes,
  };
};

const getMysteryBoxForAdmin = async (reqBody) => {
  const { vendorId, interestId } = reqBody;

  const startOfTheMonth = moment().startOf("month").format("Y-MM-DD");
  const endOfTheMonth = moment().endOf("month").format("Y-MM-DD");

  const filter = {
    createdAt: {
      $gte: startOfTheMonth,
      $lt: endOfTheMonth,
    },
  };

  if (vendorId) {
    filter.vendorId = vendorId;
  }
  if (interestId) {
    filter.interestId = interestId;
  }

  const findBoxes = await MySteryBox.find(filter)
    .populate(["userId", "productId", "vendorId"])
    .then((res) => {
      return res;
    });

  return {
    status: "success",
    message: "All mystery box orders by date",
    data: findBoxes,
  };
};

module.exports = {
  orderByVendor,
  updateOrderStatus,
  orderDetailsByVendor,
  getProductReviewByOrders,
  createMysteryBox,
  geHistoryOfMysteryBox,
  getMysteryBoxByDate,
  getMysteryBoxForAdmin,
};
