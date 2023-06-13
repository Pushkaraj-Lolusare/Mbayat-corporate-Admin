const httpStatus = require("http-status");
const moment = require("moment");
const { User, Interest, UserShippingAddress, Orders, MySteryBox, Notification, Gift, Cart, SubInterestModel, Wishlist,
  OrderItems, Payment, PaymentMethod, Subscription, MysteryBoxSetting, SubscriptionPlan, SkippedMonths, Products,
  ProductCategory, ProductSubCategory, VendorOtherDetails, Rating, Token
} = require("../models");
const ApiError = require("../utils/ApiError");
const { sendOtpToUser, generateOTP } = require("../utils/helperFunction");
const bcrypt = require("bcryptjs");
const path = require("path");
const ejs = require("ejs");
const transporter = require("../config/mailer");
const https = require("https");
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  let requestBody = userBody;
  // const { mobile_number } = requestBody;
  const otp = generateOTP();
  // const otp = await sendOtpToUser(mobile_number);
  requestBody.otp = otp;
  sendOTP(requestBody.mobile_number,requestBody.otp);
  let allowedInterest = 5;

  const getSetting = await MysteryBoxSetting.findOne({}).then((res) => {
    return res;
  });
  if(getSetting){
    if(getSetting.numberOfInterest){
      allowedInterest = getSetting.numberOfInterest;
    }
  }

  let splitInterest = requestBody.interests;
  if(splitInterest){
    splitInterest = splitInterest.split(',');
    if(splitInterest.length !== allowedInterest){
      return {
        status: "failed",
        message: "You need to add " + allowedInterest + " Interest",
      }
    }
  }

  requestBody.interests = splitInterest;
  requestBody.subInterests = requestBody.subInterests.split(",");

  const createUser = User.create(requestBody).then((res) => { return res; });
  await Notification.create({
    userId: createUser._id,
    notification: "Congratulations! Your registration for Mbayat has been successfully completed. We are excited to have you join with Mbayat."
  });

  return createUser;
};

const sendOTP = (mobileNumber,otp) => {
  const options = {
    hostname: 'api.future-club.com',
    path: `/falconapi/fccsms.aspx?IID=2336&UID=usrMbayat&P=aebea178-8550-4642-85ed-d6bfa5265b2e&S=Mbayat&G=${mobileNumber}&M=message&L=${otp}`,
    method: 'POST',
    headers: {
      'Cookie': 'cookiesession1=678A3E0DA3F4A702390594A8C468FB7A'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(data);
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  req.end();
}

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const getUser = await User.findOne({_id: id}).populate(["interests","subInterests"]).then((res) => { return res; });
  // const response = { ...getUser.toJSON() };
  const getVendorDetails = await VendorOtherDetails.findOne({
    userId: id,
  }).then((res) => {return res;});
  let results = getUser;
  if(getVendorDetails){
    results = {
      ...getUser.toJSON(),
      ...getVendorDetails.toJSON(),
    }
  }
  return results;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email }).populate(['interests','subInterests']);
};

const getUserByPhone = async (number) => {
  const tempNumber = Number(number);
  if (typeof tempNumber !== "number") {
    return false;
  }
  return User.findOne({ mobile_number: tempNumber }).populate(['interests','subInterests']);
};

const getMasterAdminByEmail = async (email) => {
  return User.findOne({ email, role: "master_admin" });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  let allowedInterest = 5;
  const getSetting = await MysteryBoxSetting.findOne({}).then((res) => { return res; });
  if(getSetting){
    allowedInterest = getSetting.numberOfInterest;
    let splitIntersts = updateBody.interests.split(",");
    if(splitIntersts.length > allowedInterest){
      return {
        status: "failed",
        message: "Please select only " + allowedInterest + " Interests",
      }
    }

    if(updateBody.interests){
      updateBody.interests = Array.from(new Set(updateBody.interests.split(",").concat(splitIntersts)));
    }

  }

  if(updateBody.subInterests){
    let splitSubInterest = updateBody.subInterests.split(",");
    updateBody.subInterests = Array.from(new Set(updateBody.subInterests.split(",").concat(splitSubInterest)));
  }

  if(updateBody.status === ""){
    updateBody.status = "active";
  }

  Object.assign(user, updateBody);
  await user.save();
  return {
    status: "success",
    message: "User updated successfully.",
    data: user,
  };
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await User.findOne({_id: userId}).then(res => {
    return res;
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  let status = "in_active";

  if(user.status === "active"){
    status = "in_active";
  }

  if(user.status === "in_active"){
    status = "active";
  }



  if(status === "active" && user.role == "vendor"  && !user.loginDetailsSent){
    const newPassword = Math.random().toString(36).substring(2, 10);

    const savePassword = await bcrypt.hash(newPassword, 8);
    await User.updateOne(
      {
        _id: userId,
      },
      {
        password: savePassword,
        status,
      }
    );

    // define email template
    const rootDir = path.resolve(__dirname, "..");

    const templatePath = path.join(
      rootDir,
      "emails",
      "vendorLoginDetails.ejs"
    );
    const data = { email: user.email, password: newPassword }; // data to be passed to the template
    const renderedHtml = await ejs.renderFile(templatePath, data);

    // send email to vendor
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Your request for vendor account on Mbayat is approved",
      html: renderedHtml,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(info);
      }
    });
    await User.updateOne(
      {
        _id: userId,
      },
      {
        loginDetailsSent: true,
      }
    );
  }

  await User.updateOne({
    _id: userId,
  },
    {
      status: status,
    });
  return {
    status: "success",
    message: "User removed successfully.",
  };
};

const userAddInterest = async (reqBody) => {
  const { userId, interestIds } = reqBody;
  const findUser = await getUserById(userId);
  if (findUser) {
    const newInterestIds = JSON.parse(interestIds);
    if (newInterestIds.length < 5) {
      return {
        status: "failed",
        message: "You need to select 5 interest",
      };
    }

    if (newInterestIds.length > 5) {
      return {
        status: "failed",
        message: "You can't select more than 5 interest.",
      };
    }
    if (newInterestIds.length === 5) {
      const userInterests = findUser.interests;
      const findedInterestIds = [];
      userInterests.every(function (u, i) {
        if (u.toString() === newInterestIds[i].toString()) {
          findedInterestIds.push(newInterestIds[i].toString());
          return true;
        }
        return false;
      });

      if (findedInterestIds.length > 0) {
        const findInterest = await Interest.find({
          _id: { $in: findedInterestIds },
        });
        let errorMsg = "There is some interest that user already added.";
        if (findInterest) {
          const interestNames = [];
          findInterest.map((value) => interestNames.push(value.name));
          errorMsg = `This ${interestNames.toString()} interest already added.`;
        }

        return {
          status: "failed",
          message: errorMsg,
        };
      }
      const updateUser = await User.updateOne(
        { _id: userId.toString() },
        { interests: newInterestIds }
      );
      if (updateUser) {
        return {
          status: "success",
          message: "User interest added successfully.",
        };
      }
    }
  }
  return {
    status: "error",
    message: "User not found.",
  };
};

const updateUserInterest = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const { interests } = updateBody;

  if (interests.length > 5) {
    return {
      status: "failed",
      message: "You can select maximum 5 interest.",
    };
  }

  if (interests.length < 5) {
    return {
      status: "failed",
      message: "You need to select at 5 interest.",
    };
  }
  Object.assign(user, interests);
  await user.save();

  const updateUser = await User.updateOne({ _id: userId }, { interests })
    .then((res) => {
      if (res) {
        return {
          status: "success",
          message: "User interest updated successfully.",
        };
      }
      return {
        status: "failed",
        message: "Something went wrong while updating interest.",
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err.message,
      };
    });

  return updateUser;
};

const userCreateShippingAddress = async (reqBody) => {
  const { userId } = reqBody;
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return UserShippingAddress.create(reqBody)
    .then((res) => {
      if (res) {
        return {
          status: "success",
          message: "User shipping address added successfully.",
          data: res,
        };
      }
      return {
        status: "failed",
        message:
          "Something went wrong while adding user shipping address, Please try again or later.",
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err.message,
      };
    });
};

const getAllShippingAddress = async (userId) => {
  const get = await UserShippingAddress.find({ userId }).then((res) => {
    return res;
  });

  return {
    status: "success",
    message: "User shipping address added successfully.",
    data: get,
  };
};

const updateShippingAddress = async (reqBody) => {
  const { shippingId } = reqBody;
  const find = await UserShippingAddress.findOne({
    _id: shippingId,
  }).then((res) => {
    return res;
  });

  if (find) {
    const update = await UserShippingAddress.updateOne(
      {
        _id: shippingId,
      },
      {
        street1: reqBody.street1,
        street2: reqBody.street2,
        city: reqBody.city,
        state: reqBody.state,
        pinCode: reqBody.pinCode,
        country: reqBody.country,
        houseNo: reqBody.houseNo,
        apartment: reqBody.apartment,
        floor: reqBody.floor,
        avenue: reqBody.avenue,
        direction: reqBody.direction,
      }
    ).then((res) => {
      return res;
    });

    if (update) {
      return {
        status: "success",
        message: "Shipping address updated successfully.",
      };
    }
  }

  return {
    status: "failed",
    message: "Something went wrong while updating shipping address.",
  };
};

const deleteShippingAddress = async (reqBody) => {
  const { shippingId } = reqBody;

  const find = await UserShippingAddress.findOne({
    _id: shippingId,
  }).then((res) => {
    return res;
  });

  if (find) {
    const remove = await UserShippingAddress.deleteOne({
      _id: shippingId,
    }).then((res) => {
      return res;
    });

    if (remove) {
      return {
        status: "success",
        message: "Shipping address removed successfully.",
      };
    }
  }

  return {
    status: "failed",
    message: "Something went wrong while removing shipping address.",
  };
};

const getDashboardData = async () => {
  let totalUser = 0;
  let totalSubsribedUser = 0;
  let totalOrder = 0;
  let totalSales = 0;

  totalUser = await User.find({ status: "active", role: "user" }).count();
  totalSubsribedUser = await User.find({
    status: "active",
    role: "user",
    isSubscribed: true,
  }).count();

  const currentMonthStart = moment().startOf("month").toDate();

  // Get current month end date
  const currentMonthEnd = moment().endOf("month").toDate();

  const getOrders = await Orders.aggregate([
    {
      $match: {
        createdAt: {
          $gte: currentMonthStart,
          $lt: currentMonthEnd,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$subTotal",
        },
      },
    },
  ]);

  if (getOrders) {
    const [finalData] = getOrders;
    totalSales = finalData?.total ?? 0;
  }

  totalOrder = await Orders.find().count();

  const response = [
    {
      heading: "Total Users",
      money: totalUser,
      perText: "",
      sparklineData: {
        type: "line",
        data: [1, 4, 1, 3, 7, 1],
        areaStyle: {
          color: "#fac091",
        },
        itemStyle: {
          color: "#f79647",
        },
        symbolSize: 1,
      },
    },
    {
      heading: "Total Subscriber",
      money: totalSubsribedUser,
      perText: "",
      sparklineData: {
        type: "line",
        data: [1, 4, 2, 3, 6, 2],
        areaStyle: {
          color: "#a092b0",
        },
        itemStyle: {
          color: "#604a7b",
        },
        symbolSize: 1,
      },
    },
    {
      heading: "Totoal Orders",
      money: totalOrder,
      perText: "",
      sparklineData: {
        type: "line",
        data: [1, 4, 2, 3, 1, 5],
        areaStyle: {
          color: "#92cddc",
        },
        itemStyle: {
          color: "#4aacc5",
        },
        symbolSize: 1,
      },
    },
    {
      heading: "Total Sales",
      money: totalSales + " KWD",
      perText: "",
      sparklineData: {
        type: "line",
        data: [1, 3, 5, 1, 4, 2],
        areaStyle: {
          color: "#95b3d7",
        },
        itemStyle: {
          color: "#4f81bc",
        },
        symbolSize: 1,
      },
    },
  ];

  const pipeline = [
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSales: { $sum: '$subTotal' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  const getSalesData = await Orders.aggregate(pipeline)
    .then((result) => {
      // Extract the date and sales data from the result
      const dates = result.map((item) => item._id);
      const sales = result.map((item) => item.totalSales);
      return {
        dates,sales
      }
    })
    .catch((err) => {
      console.error(err);
    });

  const chartData = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: [],
      right: "4%",
      textStyle: {
        color: "#C2C2C2",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: getSalesData.dates.length === 0 ? [moment().format('Y-MM')] : getSalesData.dates,
        axisLine: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: "#C2C2C2",
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        minInterval: 100,
        splitLine: {
          lineStyle: {
            type: "dotted",
          },
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          formatter: function (value, index) {
            if (value > 0) {
              return value / 1000 + " K";
            } else {
              return 0;
            }
          },
          textStyle: {
            color: "#C2C2C2",
          },
        },
      },
    ],
    series: [
      {
        name: "Total Sales",
        type: "bar",
        stack: "Kd",
        data: getSalesData.sales.length === 0 ? [0] : getSalesData.sales,
        itemStyle: {
          color: "#6ebdd1",
        },
        barWidth: "40px",
      }
    ],
  };

  return {cardData: response, chartData};
};

const getUserSaving = async (userId) => {
  const getUser = await User.findOne({_id: userId}).then((res) => { return res; });
  if(getUser){
    // const getUserOrderLists = await Orders.find({userId}).populate('productId').then((res) => {
    //   return res;
    // });

    const getUserOrderLists = await MySteryBox.find({userId}).populate('productId').then((res) => {
      return res;
    });

    if(getUserOrderLists){

      let orderList = getUserOrderLists;
      const monthlySavings = {};

      let subscriptionAmount = 0;
      const getUserSubscriptionDetails = await Subscription.findOne({ userId, status: "running" }).then((res) => { return res; });
      if(getUserSubscriptionDetails){
        subscriptionAmount = getUserSubscriptionDetails.totalPaidAmount;
      }
// Loop through the orders and calculate savings for each month
      for (const order of orderList) {
        const orderDate = moment(order.orderDate,'Y-DD-MM').format('Y-MM-DD');
        const year = moment(orderDate).format('Y');
        const month = moment(orderDate).format('MM');
        const monthKey = `${year}-${month.toString().padStart(2, '0')}`;

        // const costAtSellingPrice = order.productId.sellingPrice * order.totalQuantity;
        // const costAtPurchasePrice = order.productPrice * order.totalQuantity;
        const savings = order.productId.sellingPrice - subscriptionAmount;
        if (monthlySavings[monthKey]) {
          monthlySavings[monthKey] += savings;
        } else {
          monthlySavings[monthKey] = savings;
        }
      }

// Define an array of month names to format the output
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
      ];

// Construct an array of monthly savings objects for the output
      const monthlySavingsArray = Object.entries(monthlySavings).map(([monthKey, savings]) => {
        const [year, month] = monthKey.split('-');
        if(savings < 0){
          savings = 0;
        }

        const monthNumber = moment().locale('en').month(monthNames[Number(month) - 1]).format('MM');
        let makeDate = `${year}-${monthNumber}`;

        return {
          month: monthNames[Number(month) - 1],
          year,
          totalSaving: `${savings} kwd`,
          date: makeDate,
        };
      });

      return {
        status: "success",
        message: "Here is your saving history",
        data: monthlySavingsArray
      }
    }else{
      return {
        status: "failed",
        message: "You haven't place any order or received any mystery box."
      }
    }
  }

  return {
    status: "failed",
    message: "Something went wrong while getting user saving",
  }
};

const getSavingDetails = async (userId,savingDate) => {
  const getUser = await User.findOne({_id: userId}).then((res) => { return res; });
  if(getUser){
    const date = savingDate;

    const startOfMonth = moment(date, 'YYYY-MM').startOf('month').toDate();
    const endOfMonth = moment(date, 'YYYY-MM').endOf('month').toDate();

    const getUserOrders = await Orders.find({userId, createdAt: {
        $gte: new Date(startOfMonth),
        $lt: new Date(endOfMonth)
      } }).populate(['productId']).then((res) => {
      return res;
    });
    if(getUserOrders){

      return {
        status: "success",
        message: "Here is order list of month",
        data: getUserOrders,
      }
    }

    return {
      status: "failed",
      message: "You haven't place any order or received any mystery box."
    }
  }

  return {
    status: "failed",
    message: "Something went wrong while getting user saving",
  }
}

const getMysteryBoxOrders = async (filter, options) => {
  const date = moment();
  const startOfMonth = date.startOf('month').format('YYYY-MM-DD');
  const endOfMonth = date.endOf('month').format('YYYY-MM-DD');

  let finalFilter = {
    createdAt: {
      $gte: new Date(startOfMonth),
      $lt: new Date(endOfMonth)
    }
  };

  if(filter.orderType === "history"){
    finalFilter = {
      createdAt: {
        $lt: new Date(startOfMonth)
      }
    };
  }

  if(filter.vendorId){
    finalFilter = {
      ...finalFilter,
      ...{
        vendorId: filter.vendorId,
      }
    };
  }

  options.populate = "userId,vendorId,productId";
  const getUpcomingOrders = await MySteryBox.paginate(finalFilter, options);

  if(getUpcomingOrders){
    return {
      status: "success",
      message: "Mystery Box order lists",
      ...getUpcomingOrders
    }
  }

}

const getUsersMysteryBox = async (userId) => {
  const getMysteryBox = await MySteryBox.find({
    userId,
  }).populate(['userId','vendorId','productId']).then((res) => {
    return res;
  });

  if(getMysteryBox){
    return {
      status: "success",
      message: "Mystery found",
      data: getMysteryBox,
    }
  }

  return {
    status: "failed",
    message: "Mystery box not found"
  }
}

const getUserMysteryBoxDetails = async (userId,orderDate) => {
  const getMysteryBox = await MySteryBox.find({
    userId,
    orderDate
  }).populate(['userId','vendorId','productId']).then((res) => {
    return res;
  });

  if(getMysteryBox){
    return {
      status: "success",
      message: "Mystery details",
      data: getMysteryBox,
    }
  }

  return {
    status: "failed",
    message: "Mystery box not found"
  }
}

const checkUser = async (reqBody) => {

  const { email,mobile_number,userType } = reqBody;

  let filter = {
    role: userType,
  };

  if(email){
    filter.email = email;
  }

  if(mobile_number){
    filter.mobile_number = mobile_number;
  }

  const get = await User.findOne(filter).then((res) => {
    return res;
  });
  if(get){
    return {
      status: "success",
      message: "This user account is already exist.",
    }
  }

  return {
    status: "failed",
    message: "User not found"
  }
}

const clearDatabase = async () => {
  await User.deleteMany();
  await Interest.deleteMany();
  await SubInterestModel.deleteMany();
  await UserShippingAddress.deleteMany();
  await Wishlist.deleteMany();
  await Notification.deleteMany();
  await Orders.deleteMany();
  await OrderItems.deleteMany();
  await Payment.deleteMany();
  await PaymentMethod.deleteMany();
  await Subscription.deleteMany();
  await Gift.deleteMany();
  await Rating.deleteMany();
  await MySteryBox.deleteMany();
  await Cart.deleteMany();
  await MysteryBoxSetting.deleteMany();
  await SubscriptionPlan.deleteMany();
  await SkippedMonths.deleteMany();
  await Products.deleteMany();
  await ProductCategory.deleteMany();
  await ProductSubCategory.deleteMany();
  await VendorOtherDetails.deleteMany();
  await Token.deleteMany();

  return {
    status: "success",
  }
}

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByPhone,
  updateUserById,
  deleteUserById,
  getMasterAdminByEmail,
  userAddInterest,
  updateUserInterest,
  userCreateShippingAddress,
  getAllShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  getDashboardData,
  getUserSaving,
  getSavingDetails,
  getMysteryBoxOrders,
  getUsersMysteryBox,
  checkUser,
  clearDatabase,
  getUserMysteryBoxDetails,
};
