const { Interest, User, SubInterestModel, SkippedMonths, MySteryBox} = require("../models");
const moment = require("moment");

const createInterest = async (reqBody) => {
  if (await Interest.isNameTaken(reqBody.name)) {
    return {
      status: "failed",
      message: "This interest is already added.",
    };
  }

  const create = await Interest.create(reqBody);
  if (create) {



    return {
      status: "success",
      message: "Interest Created successfully.",
      data: create,
    };
  }
  return {
    status: "failed",
    message:
      "Something went wrong while creating Interest, Please try again or later.",
  };
};

const queryInterest = async (filter, options) => {
  let interest = [];

  if (options.fetchType !== undefined && options.fetchType === "all") {
    interest = await Interest.find({ status: "active" }).then((res) => {
      return res;
    });
  } else {
    interest = await Interest.paginate(filter, options);
  }

  let response = [];
  if (options.fetchType !== undefined && options.fetchType === "all") {
    response = await Promise.all(
      interest.map(async (value) => {
        const object = { ...value.toJSON() };

        const getInterest = await User.find({
          interests: value.id.toString(),
          role: "user",
        }).count();

        const getTotalVendors = await User.find({
          interests: value.id.toString(),
          role: "vendor",
        }).count();

        const getSubInterest = await SubInterestModel.find({
          interestId: value.id.toString(),
        }).count();

        object.totalUser = getInterest;
        object.totalSubInterest = getSubInterest;
        object.totalVendor = getTotalVendors;
        return object;
      })
    );
  }else{
    response = await Promise.all(
      interest.results.map(async (value) => {
        const object = { ...value.toJSON() };

        const getInterest = await User.find({
          interests: value.id.toString(),
          role: "user",
        }).count();

        const getSubInterest = await SubInterestModel.find({
          interestId: value.id.toString(),
        }).count();

        const getTotalVendors = await User.find({
          interests: value.id.toString(),
          role: "vendor",
        }).count();

        object.totalUser = getInterest;
        object.totalSubInterest = getSubInterest;
        object.totalVendor = getTotalVendors;
        return object;
      })
    );
  }

  return {
    results: response,
    page: interest.page ?? "",
    limit: interest?.limit ?? "",
    totalPages: interest?.totalPages ?? "",
    totalResults: interest?.totalResults ?? "",
  };
};

const updateInterest = async (reqBody) => {
  const { interestId, name } = reqBody;
  const update = await Interest.updateOne(
    { _id: interestId.toString() },
    { name }
  )
    .then((res) => {
      if (res) {
        return {
          status: "success",
          message: "Success! Interest Updated successfully.",
        };
      }
      return {
        status: "failed",
        message:
          "Something went wrong while updating interest, Please try again or later.",
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err.message,
      };
    });

  return update;
};

const removeInterest = async (reqBody) => {
  const { interestId, newInterestId } = reqBody;

  const getUsers = await User.find({
    interests: interestId,
  }).then((res) => {
    return res;
  });

  if(getUsers){
    await User.updateMany({
      interests: interestId,
    },{
      interests: newInterestId
    } , { $set: { "interests.$": newInterestId } });
  }
  const update = await Interest.updateOne(
    { _id: interestId.toString() },
    { status: "in_active" }
  )
    .then((res) => {
      if (res) {
        return {
          status: "success",
          message: "Success! Interest Removed successfully.",
        };
      }
      return {
        status: "failed",
        message:
          "Something went wrong while removing interest, Please try again or later.",
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err.message,
      };
    });



  return update;
};

const userByInterest = async (interestId, queryParams) => {
  const { fetchType, vendorId } = queryParams;
  let getUser = await User.paginate(
    {
      interests: { $in: interestId },
      role: queryParams.role ? queryParams.role : "user",
    },
    {}
  );

  if (fetchType !== undefined && fetchType === "all") {
    getUser = await User.find({
      interests: { $in: interestId },
      status: "active",
      role: queryParams.role ? queryParams.role : "user",
    }).populate(["interests","subInterests"]);
  }

  let skipMonthStatus = "continue";

  if(vendorId){
    const currentMonth = moment().format('Y-MM');
    const getSkipedMonth = await SkippedMonths.findOne({
      vendorId,
      month: currentMonth,
    }).then((res) => {
      return res;
    });

    if(getSkipedMonth){
      skipMonthStatus = "skipped";
    }

    const extraUserIdArray = [];
    const getMysteryBoxOrderByVendor = await MySteryBox.find({vendorId}).then((res) => {return res;});
    if(getMysteryBoxOrderByVendor){
      const getUserIdArray = [];
      for(let i = 0; i < getMysteryBoxOrderByVendor.length; i++){
        const data = getMysteryBoxOrderByVendor[i];
        const userId = data.userId;
        if(moment(data.orderDate).format('Y-MM') < moment().format('Y-MM')){
          getUserIdArray.push(userId);
        }
        extraUserIdArray.push(userId.toString());
      }

      getUser = await User.find({
        _id: {$nin: getUserIdArray},
        interests: { $in: interestId },
        status: "active",
        isSubscribed: true,
        role: queryParams.role ? queryParams.role : "user",
      }).populate(["interests","subInterests"]).then((res) => {
        const modifiedUsers = res.map(user => {
          let sent = false;
          console.log(extraUserIdArray,'extraUserIdArray');
          console.log(user.id.toString(),'user.id.toString()');
          if(extraUserIdArray.includes(user.id.toString())){
            sent = true;
          }
          return { ...user.toJSON(), sent };
        });

        return modifiedUsers;
      });

    }

  }

  return {
    status: "success",
    message: "User list by interest",
    skip_month_status: skipMonthStatus,
    data: getUser,
  };
};

const createSubInterest = async (reqBody) => {
  const { interestId, name } = reqBody;

  const checkAlreadyExist = await SubInterestModel.findOne({
    interestId,
    name,
  }).then((res) => {
    return res;
  });

  if (checkAlreadyExist) {
    return {
      status: "failed",
      message: "This Sub Interest is already exist.",
    };
  }

  const create = await SubInterestModel.create({
    interestId,
    name,
  }).then((res) => {
    return res;
  });

  if (create) {
    return {
      status: "success",
      message: "Sub interest created successfully.",
    };
  }
  return {
    status: "failed",
    message: "Something went wrong while adding sub interest.",
  };
};

const getSubInterestById = async (interestId) => {
  return SubInterestModel.find({ interestId, status: "active" })
    .then((res) => {
      if (res) {
        return {
          status: "success",
          message: "Sub interest lists",
          data: res,
        };
      }
      return {
        status: "failed",
        message: "Something went wrong while getting sub interest.",
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err.message,
      };
    });
};

module.exports = {
  createInterest,
  queryInterest,
  updateInterest,
  removeInterest,
  userByInterest,
  createSubInterest,
  getSubInterestById,
};
