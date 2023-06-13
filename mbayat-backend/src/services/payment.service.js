const moment = require("moment");
const {
  Payment,
  PaymentMethod,
  User,
  MySteryBox,
  PaymentHistory,
  Notification,
} = require("../models");

const createPayment = async (reqBody) => {
  const create = await Payment.create(reqBody);
  if (create) {
    return {
      status: "success",
      message: "Payment created successfully.",
    };
  }
  return {
    status: "error",
    message: "Something went wrong while adding payment",
  };
};

const getAllPaymentList = async (filter, options) => {
  let getPayment = [];

  if (options.fetchType === "all") {
    const finalFilter = {};
    if (filter.vendorId !== "") {
      finalFilter.vendorId = filter.vendorId;
    }
    getPayment = await Payment.find(finalFilter)
      .populate(["userId", "productId"])
      .then((res) => {
        return res;
      });
  } else {
    const finalFilter = {};
    if (filter.vendorId !== "") {
      finalFilter.vendorId = filter.vendorId;
    }
    if (filter.paymentMonths !== "") {
      const monthYear = `${filter.paymentMonths}-${moment().format("YYYY")}`;
      const date = moment(monthYear, "MM-YYYY");
      const startOfMonth = date.startOf("month").format("YYYY-MM-DD");
      const endOfMonth = date.endOf("month").format("YYYY-MM-DD");

      finalFilter.createdAt = {
        $gte: new Date(startOfMonth),
        $lt: new Date(endOfMonth),
      };
    }
    getPayment = await Payment.paginate(finalFilter, options);
  }

  return {
    status: "success",
    message: "Payment List",
    data: getPayment,
  };
};

const editPayment = async (reqBody) => {
  const { userId, paymentId, status } = reqBody;

  const update = await Payment.updateOne(
    {
      _id: paymentId,
      userId,
    },
    {
      paymentStatus: status,
    }
  );

  if (update) {
    return {
      status: "success",
      message: "Payment detail updated successfully.",
    };
  }
  return {
    status: "error",
    message:
      "Something went wrong while updating payment method, Please try again or later.",
  };
};

const addUserPaymentMethod = async (reqBody) => {
  const { type, details } = reqBody;

  const checkPaymentAlreadyExist = await PaymentMethod.findOne({
    type,
    details,
  }).then((res) => {
    return res;
  });
  if (checkPaymentAlreadyExist) {
    return {
      status: "failed",
      message: "This payment method is already exists.",
    };
  }

  const addPayment = await PaymentMethod.create(reqBody);
  if (addPayment) {
    return {
      status: "success",
      message: "Payment Method added successfully.",
    };
  }
  return {
    status: "failed",
    message:
      "Something went wrong while adding payment method, Please try again or later.",
  };
};

const changeDefaultPaymentMethod = async (reBody) => {
  const { paymentMethodId, userId } = reBody;

  const findCurrentDefaultMethod = await PaymentMethod.findOne({
    userId,
    default: true,
  }).then((res) => {
    return res;
  });

  if (findCurrentDefaultMethod) {
    // remove previous default payment method
    await PaymentMethod.updateOne(
      { _id: findCurrentDefaultMethod._id },
      {
        default: false,
      }
    );
  }

  const updateDefaultMethod = await PaymentMethod.updateOne(
    { _id: paymentMethodId },
    {
      default: true,
    }
  );

  if (updateDefaultMethod) {
    return {
      status: "success",
      message: "Default Payment Method updated successfully.",
    };
  }
  return {
    status: "failed",
    message: "Something went wrong while changing default payment method.",
  };
};

const getAllPaymentMethodByUser = async (userId) => {
  const get = await PaymentMethod.find({ userId })
    .populate("userId")
    .then((res) => {
      return res;
    });
  if (get) {
    return {
      status: "success",
      message: "User all payment method list.",
      data: get,
    };
  }
  return {
    status: "failed",
    message:
      "Something went wrong or maybe you haven't added any payment method.",
  };
};

const getUserDefaultPaymentMethod = async (userId) => {
  const get = await PaymentMethod.findOne({ userId, default: true })
    .populate("userId")
    .then((res) => {
      return res;
    });
  if (get) {
    return {
      status: "success",
      message: "User default payment method",
      data: get,
    };
  }

  return {
    status: "failed",
    message: "Something went wrong while getting default payment method.",
  };
};

const editPaymentMethod = async (reqBody) => {
  const { userId, paymentMethodId, type, details, isDefault } = reqBody;

  const checkOtherMethod = await PaymentMethod.findOne({
    _id: { $ne: paymentMethodId },
    userId,
    type,
    details,
  }).then((res) => {
    return res;
  });

  if (checkOtherMethod) {
    return {
      status: "failed",
      message: "Same payment method is already exist.",
    };
  }

  const update = await PaymentMethod.updateOne(
    {
      _id: paymentMethodId,
      userId,
    },
    {
      type,
      details,
      default: isDefault,
    }
  );

  if (update) {
    return {
      status: "success",
      message: "Payment method updated successfully.",
    };
  }

  return {
    status: "failed",
    message:
      "Something went wrong while updating payment method, Please try again or later.",
  };
};

const deletePaymentMethod = async (reqBody) => {
  const { userId, paymentMethodId } = reqBody;

  const deleteMethod = await PaymentMethod.deleteOne({
    _id: paymentMethodId,
    userId,
  });
  if (deleteMethod) {
    return {
      status: "success",
      message: "Payment method removed successfully",
    };
  }

  return {
    status: "failed",
    message: "Something went wrong while deleting payment method.",
  };
};

const generateAllVendorPayment = async (reqBody) => {
  const startOfMonth = moment().startOf("month");

  // Get current month end date
  const endOfMonth = moment().endOf("month");

  // Format the dates as desired
  const formattedStart = startOfMonth.format("Y-MM-DD");
  const formattedEnd = endOfMonth.format("Y-MM-DD");

  const getAllVendors = await User.find({
    role: "vendor",
  }).then((res) => {
    return res;
  });

  if (getAllVendors.length > 0) {
    getAllVendors.map(async (vendors) => {
      const getBoxes = await MySteryBox.find({
        vendorId: vendors.id,
        orderDate: {
          $gte: formattedStart,
          $lte: formattedEnd,
        },
      });

      return vendors;
    });
  }

  return {
    status: "failed",
    message: "No vendor found for generate payment.",
  };
};

const vendorPaymentLists = (reqBody) => {
  const { vendorId } = reqBody;
};

const fetchAllPaymentService = async () => {
  const getPayment = await Payment.find()
    .populate(["userId", "productId", "vendorId"])
    .then((res) => {
      return res;
    });

  return {
    status: "success",
    message: "Payment List",
    data: getPayment,
  };
};

const paymentSuccess = async (req) => {
  const { query } = req;
  const { body } = req;

  const checkPayment = await PaymentHistory.findOne({
    userId: query.userId,
    trackId: body.trackId,
  }).then((res) => {
    return res;
  });

  if (body.paymentStatus === "CAPTURED") {
    if (checkPayment) {
      const updatePayment = await PaymentHistory.updateOne(
        {
          _id: checkPayment._id,
        },
        {
          payzahRefrenceCode: body.payzahRefrenceCode,
          knetPaymentId: body.knetPaymentId,
          paymentId: body.paymentId,
          transactionNumber: body.transactionNumber,
          trackingNumber: body.trackingNumber,
          paymentDate: body.paymentDate,
          paymentStatus: body.paymentStatus,
        }
      );

      if (updatePayment) {

        await Notification.create({
          userId: query.userId,
          notification:
            "Congratulations! We want to inform you that your payment has been successfully processed.",
          paymentDetails: {
            text1: `Payment Amount: \`${query.amount}\``,
            text2: `Payment Date: \`${query.amount}\``,
            text3: `Payment Method: Bank`,
            text4: `Thank you for completing the payment for your order/subscription. Your transaction has been successfully processed.`,
          },
        });
        
        return {
          status: "success",
          message: "Payment made successfully.",
        };
      }
    } else {
      const createPaymentHistory = await PaymentHistory.create({
        userId: query.userId,
        payzahRefrenceCode: body.payzahRefrenceCode,
        trackId: body.trackId,
        knetPaymentId: body.knetPaymentId,
        paymentId: body.paymentId,
        transactionNumber: body.transactionNumber,
        trackingNumber: body.trackingNumber,
        paymentDate: body.paymentDate,
        paymentStatus: body.paymentStatus,
      }).then((res) => {
        return res;
      });

      if (createPaymentHistory) {
        await Notification.create({
          userId: query.userId,
          notification:
            "Congratulations! We want to inform you that your payment has been successfully processed.",
          paymentDetails: {
            text1: `Payment Amount: \`${query.amount}\``,
            text2: `Payment Date: \`${query.amount}\``,
            text3: `Payment Method: Bank`,
            text4: `Thank you for completing the payment for your order/subscription. Your transaction has been successfully processed.`,
          },
        });

        return {
          status: "success",
          message: "Payment made successfully.",
        };
      }
    }
  } else if (checkPayment) {
    await PaymentHistory.updateOne(
      {
        _id: checkPayment._id,
      },
      {
        payzahRefrenceCode: body.payzahRefrenceCode,
        knetPaymentId: body.knetPaymentId,
        paymentId: body.paymentId,
        transactionNumber: body.transactionNumber,
        trackingNumber: body.trackingNumber,
        paymentDate: body.paymentDate,
        paymentStatus: body.paymentStatus,
      }
    );
  } else {
    await PaymentHistory.create({
      userId: query.userId,
      payzahRefrenceCode: body.payzahRefrenceCode,
      trackId: body.trackId,
      knetPaymentId: body.knetPaymentId,
      paymentId: body.paymentId,
      transactionNumber: body.transactionNumber,
      trackingNumber: body.trackingNumber,
      paymentDate: body.paymentDate,
      paymentStatus: body.paymentStatus,
    }).then((res) => {
      return res;
    });
  }

  return {
    status: "failed",
    message: "Payment failed, Please try again or later.",
    error: body,
  };
};

const savePaymentId = async (reqBody) => {
  const { userId, trackId } = reqBody;

  const createPaymentHistory = await PaymentHistory.create({
    userId,
    trackId,
    paymentStatus: "processing",
  }).then((res) => {
    return res;
  });

  if (createPaymentHistory) {
    return {
      status: "success",
      message: "Payment tracking created successfully",
    };
  }
  return {
    status: "failed",
    message: "Payment tracking failed, Please try again or later.",
  };
};

const checkPaymentTracking = async (reqBody) => {
  const { userId, trackId } = reqBody;

  const getTracking = await PaymentHistory.findOne({ userId, trackId }).then(
    (res) => {
      return res;
    }
  );

  let paymentStatus = "";

  if (getTracking) {
    paymentStatus = getTracking.paymentStatus;
  }

  return {
    paymentStatus,
  };
};

module.exports = {
  createPayment,
  getAllPaymentList,
  editPayment,
  addUserPaymentMethod,
  changeDefaultPaymentMethod,
  getAllPaymentMethodByUser,
  getUserDefaultPaymentMethod,
  deletePaymentMethod,
  editPaymentMethod,
  fetchAllPaymentService,
  paymentSuccess,
  savePaymentId,
  checkPaymentTracking,
};
