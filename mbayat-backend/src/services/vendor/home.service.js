const { User, Orders } = require("../../models");
const { userService } = require("../index");

const getHomeData = async (userId) => {
  const getUser = await userService.getUserById(userId);

  if (getUser) {
    const getOrders = await Orders.find({
      vendorId: userId,
    }).then((res) => {
      return res;
    });

    let totalOrders = 0;
    let finalTotalIncome = 0;

    for (let i = 0; i < getOrders.length; i += 1) {
      const data = getOrders[i];
      totalOrders += 1;
      finalTotalIncome += data.subTotal;
    }

    return {
      status: "success",
      message: "Here is vendor home data",
      individualOrder: {
        totalIndividualOrder: totalOrders,
        totalIncome: `${finalTotalIncome} KWD`,
        totalOrder: totalOrders,
      },
      b2bOrder: {
        totalb2bOrder: 0,
        totalIncome: "0 KWD",
        totalOrder: 0,
      },
      paymentDetails: {
        totalPendingBalance: 0,
        totalBalance: 0,
        totalWithdrawn: 0,
      },
    };
  }

  return {
    status: "failed",
    message: "Vendor not found.",
  };
};

const getAllVendorLists = async (filters, options) => {
  const get = await User.paginate(filters, options);

  return {
    status: "success",
    message: "Get all vendor lists",
    ...get,
  };
};

module.exports = {
  getHomeData,
  getAllVendorLists,
};
