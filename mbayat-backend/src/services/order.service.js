const moment = require("moment/moment");
const { Orders, OrderItems, Notification, User} = require("../models");

const placeOrder = async (reqBody) => {
  // let orderCreated = false;
  const { orderData } = reqBody;

  let createOrder = true;

  for (let i = 0; i < orderData.length; i += 1) {
    const order = orderData[i];

    const place = await Orders.create(order).then((res) => {
      return res;
    });
    if (place) {
      const getUserDetails = await User.findOne({ _id: order.userId }).then(
        (res) => {
          return res;
        }
      );
      let customerName = "";
      if (getUserDetails) {
        customerName = getUserDetails.first_name;
      }
      await Notification.create({
        userId: order.vendorId,
        notification: "You have received a new order",
        orderDetails: {
          text1: "Order Number: ",
          text2: `Order Date: ${moment().format("Y-MM-DD")}`,
          text3: `Customer Name: ${customerName}`,
          text4: `Please review the order details and make necessary arrangements for processing and fulfillment.`,
        },
      });

      await Notification.create({
        userId: order.userId,
        notification:
          "Thank you for placing an order with Mbayat! We're excited to fulfill your request.",
        orderDetails: {
          text1: "Order Number: ",
          text2: `Order Date: ${moment().format("Y-MM-DD")}`,
          text3: `We look forward to delivering a seamless and enjoyable shopping experience.`,
        },
      });
    }

    if (!place) {
      createOrder = false;
    }
  }

  if (createOrder) {
    return {
      status: "success",
      message: "Order placed successfully.",
    };
  }
  return {
    status: "failed",
    message:
      "Something went wrong while placing order please try again or later.",
  };
};

const fetchOrders = async (userId, idRequired = false, filter, option) => {
  let tempFilter = {};
  if (!idRequired) {
    tempFilter = { userId };
  } else {
    tempFilter = filter;
  }

  if (filter.orderStatus) {
    const date = moment();
    const startOfMonth = moment(date, "YYYY-MM").startOf("month").toDate();
    const endOfMonth = moment(date, "YYYY-MM").endOf("month").toDate();

    if (filter.orderStatus === "current") {
      tempFilter = {
        createdAt: {
          $gte: new Date(startOfMonth),
          $lt: new Date(endOfMonth),
        },
      };
    }

    if (filter.orderStatus === "history") {
      tempFilter = {
        orderStatus: filter.status ?? "pending"
        // createdAt: {
        //   $lte: new Date(startOfMonth),
        // },
      };
    }
  }

  const getOrders = await Orders.paginate(tempFilter, option);

  if (getOrders && getOrders.results.length > 0) {
    const orderResponse = [];

    for (let i = 0; i < getOrders.results.length; i += 1) {
      const getOrderItems = await OrderItems.find({
        orderId: getOrders.results[i].id,
      }).then((res) => res);
      const order = getOrders.results[i];
      orderResponse.push({
        order,
        ...{ orderItems: getOrderItems },
      });
    }

    return {
      status: "success",
      message: "Your placed order list",
      data: orderResponse,
      page: getOrders.page,
      limit: getOrders.limit,
      totalPages: getOrders.totalPages,
      totalResults: getOrders.totalResults,
    };
  }
  return {
    status: "failed",
    message: "You haven't placed any order yet.",
  };
};

const getOrderByUser = async (userId, filter, options) => {
  return fetchOrders(userId, false, filter, options);
};

const allOrderList = async (filter, option) => {
  return fetchOrders(null, true, filter, option);
};

const getOrderDetails = async (orderId) => {
  const getOrder = await Orders.findOne({ _id: orderId })
    .populate(["userId", "vendorId", "productId"])
    .then((res) => {
      return res;
    });

  return {
    status: "success",
    message: "Order details",
    data: getOrder,
  };
};

module.exports = {
  placeOrder,
  getOrderByUser,
  allOrderList,
  getOrderDetails,
};
