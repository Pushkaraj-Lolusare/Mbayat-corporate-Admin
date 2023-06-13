const moment = require("moment");
const {
  User,
  Subscription,
  MysteryBoxSetting,
  Notification,
} = require("../models");

const createSubscription = async (reqBody) => {
  const { userId, totalMonths } = reqBody;

  const checkUserId = await User.findOne({
    _id: userId,
  }).then((res) => {
    return res;
  });

  if (checkUserId) {
    //   check user have already subscription
    const checkSubscription = await Subscription.findOne({
      userId,
      status: "running",
    }).then((res) => {
      return res;
    });

    let startDate = moment().format("Y-MM-DD");
    let endDate = moment(startDate)
      .add(Number(totalMonths), "months")
      .format("Y-MM-D");
    let subscriptionIsActive = false;
    let subScriptionStatus = "running";
    if (checkSubscription) {
      const currentSubscrptionEndDate = moment(
        checkSubscription.endDate
      ).format("Y-MM-D");
      startDate = moment(currentSubscrptionEndDate)
        .add(1, "days")
        .format("Y-MM-D");
      endDate = moment(startDate)
        .add(Number(totalMonths), "months")
        .format("Y-MM-D");

      subscriptionIsActive = true;
    }

    if (subscriptionIsActive) {
      subScriptionStatus = "upcoming";
    }

    const addSubscription = await Subscription.create({
      userId,
      interestIds: reqBody.interests ? reqBody.interests.split(",") : [],
      paymentMethodId: reqBody.paymentMethodId ? reqBody.paymentMethodId : null,
      shippingId: reqBody.shippingAddressId ? reqBody.shippingAddressId : null,
      totalMonths,
      totalPaidAmount: reqBody.totalPaidAmount,
      startDate,
      endDate,
      status: subScriptionStatus,
      subscriptionType: "Monthly",
    }).then((res) => {
      return res;
    });

    if (addSubscription) {
      await User.updateOne(
        {
          _id: userId,
        },
        {
          isSubscribed: true,
        }
      ).then((res) => {
        return res;
      });

      if (reqBody.isGift !== undefined && reqBody.isGift) {
        await Notification.create({
          userId,
          notification: `Good news! You have just received a subscription from ${checkUserId.first_name}`,
          subscriptionDetails: {
            text1: `Subscription Duration: ${totalMonths}`,
            text2: `Subscription Start Date:${startDate}`,
            text3: `Subscription End Date:${endDate}`,
          },
        });

        if (reqBody.senderId !== undefined && reqBody.senderId) {
          await Notification.create({
            userId: reqBody.senderId,
            notification: `We are pleased to inform you that the subscriptions you sent have been successfully sent to ${checkUserId.first_name}.`,
            subscriptionDetails: {
              text1: `Subscription Duration: ${totalMonths}`,
              text2: `Subscription Start Date:${startDate}`,
              text3: `Subscription End Date:${endDate}`,
            },
          });
        }
      } else {
        await Notification.create({
          userId,
          notification: "Thank you for subscribing to Mbayat!",
          subscriptionDetails: {
            text1: `Subscription Duration: ${totalMonths}`,
            text2: `Subscription Start Date:${startDate}`,
            text3: `Subscription End Date:${endDate}`,
            text4:
              "We appreciate your subscription and look forward to providing you with a remarkable experience.",
          },
        });
      }

      return {
        status: "success",
        message: "Subscription created successfully.",
        data: addSubscription,
      };
    }
    return {
      status: "failed",
      message:
        "Something went wrong while creating subscription, Please try again or later.",
    };
  }
  return {
    status: "failed",
    message: "User not found.",
  };
};

const getUserSubscriptionLists = async (filter, options) => {
  const getSubscriptions = await Subscription.paginate(filter, options);

  let tempResults = [];
  if (getSubscriptions.results.length > 0) {
    let cutOffDate = "";
    const getSetting = await MysteryBoxSetting.findOne({}).then((res) => {
      return res;
    });
    if (getSetting) {
      cutOffDate = getSetting.cutOfDate;
    }
    tempResults = getSubscriptions.results.map((result) => {
      let newBoxDate = "";
      if (result.status === "running" && cutOffDate !== "") {
        const todayDate = moment().format("Y-MM-DD");

        if (cutOffDate <= moment(result.endDate).format("Y-MM-DD")) {
          let getNextMonthCutOfDate = cutOffDate;
          if (cutOffDate <= todayDate) {
            getNextMonthCutOfDate = moment(cutOffDate)
              .add(1, "month")
              .format("Y-MM-DD");
          }

          const getDayDiff = moment(getNextMonthCutOfDate).diff(
            moment(todayDate),
            "days"
          );

          if (getDayDiff > 0) {
            newBoxDate = moment(todayDate)
              .add(getDayDiff, "days")
              .format("Y-MM-DD");
          }
        }
      }

      return {
        ...result.toJSON(),
        nextBoxDate: newBoxDate,
      };
    });
  }

  return {
    status: "success",
    message: "Here is all your subscription lists.",
    ...getSubscriptions,
    results: tempResults,
  };
};

const updateSubscription = async (reqBody) => {
  const { userId, subscriptionId, status } = reqBody;

  const getSubscription = await Subscription.findOne({
    _id: subscriptionId,
    userId,
  }).then((res) => {
    return res;
  });

  if (getSubscription) {
    if (status === "pause") {
      await Subscription.updateOne(
        {
          _id: subscriptionId,
        },
        {
          pauseUntil: reqBody.pauseUntil,
          status,
        }
      );

      await Notification.create({
        userId,
        notification: "Your subscription is paused.",
      });
    } else {
      await Subscription.updateOne(
        {
          _id: subscriptionId,
        },
        {
          pauseUntil: null,
          status: "running",
        }
      );

      await Notification.create({
        userId,
        notification: "Your subscription is resumed.",
      });
    }

    return {
      status: "success",
      message: "Subscription updated successfully.",
    };
  }
  return {
    status: "failed",
    message: "Something went wrong while updating subscription",
  };
};

module.exports = {
  createSubscription,
  getUserSubscriptionLists,
  updateSubscription,
};
