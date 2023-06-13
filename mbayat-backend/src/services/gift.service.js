const moment = require("moment");
const { Gift, User, Subscription, Notification } = require("../models");
const { createSubscription } = require("./subscription.service");

const giftSubscription = async (reqBody) => {
  const {
    userId,
    firstName,
    lastName,
    countryCode,
    mobileNumber,
    totalMonths,
  } = reqBody;

  const checkUser = await User.findOne({
    _id: userId,
    mobile_number: mobileNumber,
  }).then((res) => {
    return res;
  });
  if (checkUser) {
    return {
      status: "failed",
      message: "You can't send gift to your self.",
    };
  }

  let receiverUserId = null;
  const checkUserAlreadyExist = await User.findOne({
    mobile_number: mobileNumber,
  }).then((res) => {
    return res;
  });

  if (checkUserAlreadyExist) {
    receiverUserId = checkUserAlreadyExist._id;
  } else {
    //   create new user account
    const createAccount = await User.create({
      first_name: firstName,
      last_name: lastName,
      country_code: countryCode,
      mobile_number: mobileNumber,
      role: "user",
    }).then((res) => {
      return res;
    });
    if (createAccount) {
      receiverUserId = createAccount._id;
    }
  }

  if (receiverUserId !== null) {
    //   add subscription to user account
    const saveSubscription = await createSubscription({
      userId: receiverUserId,
      totalMonths: reqBody.month,
      // paymentMethodId: reqBody.paymentMethodId,
      shippingAddressId: reqBody.shippingMethodId,
      totalPaidAmount: reqBody.totalAmount,
      isGift: true,
      senderId: userId,
    });

    if (saveSubscription.status === "success") {
      //   now add data into gift model
      const addGift = await Gift.create({
        giftSenderUserId: userId,
        giftReceiverUserId: receiverUserId,
        giftType: "Subscription",
        giftSubscriptionId: saveSubscription.data._id,
        subscriptionId: saveSubscription.data._id,
      }).then((res) => {
        return res;
      });
      if (addGift) {
        return {
          status: "success",
          message: "Send subscription as gift successfully to user",
        };
      }
      // delete user data
      await User.deleteOne({ _id: receiverUserId });
      await Subscription.delete({ _id: saveSubscription.data._id });
      return {
        status: "failed",
        message:
          "Something went while sending gift, Please try again or later.",
      };
    }
    // delete user data
    await User.deleteOne({ _id: receiverUserId });
    return {
      status: "failed",
      message:
        "Something went wrong while adding subscription, Please try again or later.",
    };
  }

  return {
    status: "failed",
    message: "Something went wrong while sending gift to user.",
  };
};

const getGiftHistoryByUser = async (userId, giftType) => {
  return Gift.find({ giftSenderUserId: userId, giftType })
    .populate(["giftSenderUserId", "giftReceiverUserId", "subscriptionId"])
    .then((res) => {
      if (res.length > 0) {

        for (let i = 0; i < res.length; i++) {

          let boxStatus = "pending";
          if(res[i].status === "active"){
            boxStatus = "pending";
          }else{
            boxStatus = res[i].status;
          }

          res[i] = {
            ...res[i].toJSON(),
            // Add or modify properties as needed
            status: boxStatus,
          };
        }

        return {
          status: "success",
          message: "Here is all history gift of User",
          data: res,
        };
      }
      return {
        status: "failed",
        message: "You don't have any history of sending gift",
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err.message,
      };
    });
};

const getAllGiftUserHistory = async (filter, options) => {
  const getAllGifts = await Gift.paginate(filter, options);
  return {
    status: "success",
    message: "All gift list.",
    data: getAllGifts,
  };
};

const sendBoxAsGift = async (reqBody) => {
  const { userId, phoneNumber } = reqBody;

  const checkUser = await User.findOne({
    mobile_number: phoneNumber,
  }).then((res) => {
    return res;
  });

  const getUser = await User.findOne({ userId }).then((res) => {
    return res;
  });

  let receiverId = "";

  if (checkUser) {
    receiverId = checkUser._id;
  } else {
    //   create new user
    const createUser = await User.create({
      first_name: reqBody.firstName,
      last_name: reqBody.lastName,
      country_code: reqBody.countryCode,
      mobile_number: reqBody.phoneNumber,
      gender: reqBody.gender,
      interests: reqBody.interests.split(","),
    }).then((res) => {
      return res;
    });
    if (createUser) {
      receiverId = createUser._id;
    }
  }

  if (receiverId !== "") {
    const giftBody = {
      giftSenderUserId: userId,
      giftReceiverUserId: receiverId,
      giftType: "Box",
      notes: reqBody.notes,
      totalMonths: reqBody.totalMonths,
      totalAmount: reqBody.totalAmount,
    };
    const createGift = await Gift.create(giftBody).then((res) => {
      return res;
    });

    if (createGift) {
      await Notification.create({
        userId: receiverId,
        notification: `"Congratulations! ${reqBody.firstName}. A special mystery box as a gift just for you from ${getUser?.first_name}`,
      });

      await Notification.create({
        userId,
        notification:
          `Great! We wanted to let you know that we have just sent a special gift box to ${reqBody.firstName}. ` +
          "Thank you for choosing Mbayat to be a part of your gifting experience. We hope this gift brings a smile on receiver's face!",
      });

      return {
        status: "success",
        message: "Gift box sent successfully.",
      };
    }
  }

  return {
    status: "failed",
    message: "Something went wrong while sending gifts.",
  };
};

module.exports = {
  giftSubscription,
  getGiftHistoryByUser,
  getAllGiftUserHistory,
  sendBoxAsGift,
};
