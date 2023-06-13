const { SubscriptionPlan } = require("../models");

const createPlan = async (reqBody) => {
  const create = await SubscriptionPlan.create(reqBody);
  if (create) {
    return {
      status: "success",
      message: "Plan Created successfully.",
    };
  }

  return {
    status: "failed",
    message:
      "Something went wrong while creating plan, Please try again or later.",
  };
};

const getPlanLists = async () => {
  const get = await SubscriptionPlan.find({
    status: "active",
  }).then((res) => {
    return res;
  });

  return {
    status: "success",
    message: "Here is all plan Lists",
    data: get,
  };
};

const getPlanById = async (planId) => {
  const get = await SubscriptionPlan.findOne({ _id: planId }).then((res) => {
    return res;
  });
  if (get) {
    return {
      status: "success",
      message: "Here is plan details",
      data: get,
    };
  }

  return {
    status: "failed",
    message:
      "Something went wrong while getting plan, Please try again or later.",
  };
};

const updatePlan = async (reqBody) => {
  const getPlan = await SubscriptionPlan.findOne({
    _id: reqBody.planId,
  });
  if (getPlan) {
    const update = await SubscriptionPlan.updateOne(
      {
        _id: reqBody.planId,
      },
      {
        planName: reqBody.planName ? reqBody.planName : getPlan.planName,
        planPrice: reqBody.planPrice ? reqBody.planPrice : getPlan.planPrice,
        planDuration: reqBody.planDuration
          ? reqBody.planDuration
          : getPlan.planDuration,
        planType: reqBody.planType ? reqBody.planType : getPlan.planType,
        status: reqBody.status ? reqBody.status : getPlan.status,
      }
    );
    if (update) {
      return {
        status: "success",
        message: "Plan updated successfully",
      };
    }
  }

  return {
    status: "failed",
    message:
      "Something went wrong while getting plan, Please try again or later.",
  };
};

module.exports = {
  createPlan,
  getPlanLists,
  getPlanById,
  updatePlan,
};
