const httpStatus = require("http-status");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const path = require("path");
const ejs = require("ejs");
const {
  User,
  VendorOtherDetails,
  Interest,
  SkippedMonths,
  Notification,
} = require("../../models");
const { userService, tokenService } = require("../index");
const ApiError = require("../../utils/ApiError");
const transporter = require("../../config/mailer");

const registerVendor = async (uesrBody) => {
  const reqBody = uesrBody.body;
  const { email } = reqBody;
  let companyLogo = "";
  if (uesrBody.file) {
    companyLogo = uesrBody.file.location;
  }
  const checkEmail = await User.isEmailTaken(email);
  if (checkEmail) {
    return {
      status: "failed",
      message: "This email is already taken.",
    };
  }

  const createUser = await User.create({
    first_name: reqBody.firstName,
    last_name: reqBody.lastName,
    email,
    country_code: reqBody.countryCode,
    mobile_number: reqBody.mobileNumber,
    password: reqBody.password,
    interests: [reqBody.interestId],
    subInterests: reqBody.subInterestId
      ? reqBody.subInterestId.split(",")
      : null,
    role: "vendor",
    status: "in_active",
    orderHandleBy: reqBody.orderHandleBy,
  }).then((res) => {
    return res;
  });

  if (createUser) {
    const { _id } = createUser;

    const addVendorOtherDetails = await VendorOtherDetails.create({
      userId: _id,
      companyName: reqBody.companyName,
      country: reqBody.country,
      state: reqBody.state,
      city: reqBody.city,
      address: reqBody.address,
      postalCode: reqBody.postalCode,
      serviceFor: reqBody.serviceFor,
      companyLogo,
      websiteLink: reqBody.websiteLink,
      instagramLink: reqBody.instagramLink,
    }).then((res) => {
      return res;
    });
    if (addVendorOtherDetails) {
      await Notification.create({
        userId: _id,
        notification: `Congratulations! We are pleased to inform you that your registration with Mbayat was successful. Welcome to Mbayat!`,
      });

      return {
        status: "success",
        message: "You're account created successfully.",
      };
    }
    await User.deleteOne({ _id });
    return {
      status: "failed",
      message:
        "Something went wrong while creating account, Please try again or later.",
    };
  }
  return {
    status: "failed",
    message:
      "Something went wrong while creating account, Please try again or later.",
  };
};

const loginVendor = async (reqBody) => {
  const { email, password } = reqBody;
  const getUserByEmail = await userService.getUserByEmail(email);
  if (!getUserByEmail || !(await getUserByEmail.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  } else {
    if (
      getUserByEmail.role === "vendor" &&
      getUserByEmail.status === "active"
    ) {
      const tokens = await tokenService.generateAuthTokens(getUserByEmail);
      const [interests] = getUserByEmail.interests;
      const getInterest = await Interest.findOne({ _id: interests }).then(
        (res) => {
          return res;
        }
      );

      let interestName = "";
      if (getInterest) {
        interestName = getInterest.name;
      }

      const response = {
        ...getUserByEmail.toJSON(),
        ...{
          interestName,
        },
      };

      await Notification.create({
        userId: getUserByEmail.id,
        notification: `Welcome, ${getUserByEmail.first_name}! Your have successfully login.`,
      });

      return {
        user: response,
        tokens,
      };
    }
    return {
      status: "error",
      message: "Your credentials is incorrect.",
    };
  }
};

const removeVendor = async (reqBody) => {
  const { vendorId } = reqBody;

  const checkVendor = await User.findOne({
    _id: vendorId,
  }).then((res) => {
    return res;
  });

  if (checkVendor) {
    const update = await User.updateOne(
      {
        _id: vendorId,
      },
      {
        status: "in_active",
      }
    ).then((res) => {
      return res;
    });

    if (update) {
      return {
        status: "success",
        message: "Vendor removed successfully.",
      };
    }
  }
  return {
    status: "failed",
    message: "Vendor not found.",
  };
};

const getVendorDetails = async (vendorId) => {
  const get = await User.findOne({ _id: vendorId }).then((res) => {
    return res;
  });
  if (get) {
    const getOtherDetails = await VendorOtherDetails.findOne({
      userId: vendorId,
    }).then((res) => {
      return res;
    });

    let response = get;

    if (getOtherDetails) {
      response = {
        ...get.toJSON(),
        ...getOtherDetails.toJSON(),
      };
    }

    return {
      status: "success",
      message: "Vendor details found.",
      data: response,
    };
  }
  return {
    status: "failed",
    message: "Vendor not found.",
  };
};

const updateVendor = async (uesrBody) => {
  const reqBody = uesrBody.body;
  const { vendorId, status } = reqBody;

  const getUser = await User.findOne({
    _id: vendorId,
  }).then((res) => {
    return res;
  });

  let companyLogo = "";
  if (uesrBody.file) {
    companyLogo = uesrBody.file.location;
  }

  const update = await User.updateOne(
    {
      _id: vendorId,
    },
    {
      first_name: reqBody.firstName,
      last_name: reqBody.lastName,
      email: reqBody.email,
      country_code: reqBody.countryCode,
      mobile_number: reqBody.mobileNumber,
      interests: [reqBody.interestId],
      subInterests: reqBody.subInterests,
    }
  ).then((res) => {
    return res;
  });

  if (update) {
    const getDetails = await VendorOtherDetails.findOne({
      userId: vendorId,
    }).then((res) => {
      return res;
    });
    if (getDetails) {
      await VendorOtherDetails.updateOne(
        {
          userId: vendorId,
        },
        {
          companyName: reqBody.companyName,
          country: reqBody.country,
          state: reqBody.state,
          city: reqBody.city,
          address: reqBody.address,
          postalCode: reqBody.postalCode,
          serviceFor: reqBody.serviceFor,
          companyLogo:
            companyLogo === "" ? getDetails.companyLogo : companyLogo,
          websiteLink: reqBody.websiteLink,
          instagramLink: reqBody.instagramLink,
        }
      );
    }

    if (status === "active" && !getUser.loginDetailsSent) {
      const newPassword = Math.random().toString(36).substring(2, 10);

      const savePassword = await bcrypt.hash(newPassword, 8);
      await User.updateOne(
        {
          _id: vendorId,
        },
        {
          password: savePassword,
          status,
        }
      );

      // define email template
      const rootDir = path.resolve(__dirname, "../..");

      const templatePath = path.join(
        rootDir,
        "emails",
        "vendorLoginDetails.ejs"
      );
      const data = { email: reqBody.email, password: newPassword }; // data to be passed to the template
      const renderedHtml = await ejs.renderFile(templatePath, data);

      // send email to vendor
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: reqBody.email,
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
          _id: vendorId,
        },
        {
          loginDetailsSent: true,
        }
      );
    }

    await VendorOtherDetails.updateOne(
      {
        userId: vendorId,
      },
      {
        companyName: reqBody.companyName,
        country: reqBody.country,
        state: reqBody.state,
        city: reqBody.city,
        address: reqBody.address,
        postalCode: reqBody.postalCode,
        serviceFor: reqBody.serviceFor,
        websiteLink: reqBody.websiteLink,
        instagramLink: reqBody.instagramLink,
      }
    ).then((res) => {
      return res;
    });

    return {
      status: "success",
      message: "Vendor updated successfully.",
    };
  }
  return {
    status: "failed",
    message:
      "Something went wrong while updating vendor, Please try again or later.",
  };
};

const skipThisMonth = async (reqBody) => {
  const currentMonth = moment().format("Y-MM");
  const check = await SkippedMonths.findOne({
    vendorId: reqBody.vendorId,
    month: currentMonth,
  }).then((res) => {
    return res;
  });
  if (check) {
    return {
      status: "failed",
      message: "You already skipped this month for send mystery Box",
    };
  }

  const create = SkippedMonths.create({
    vendorId: reqBody.vendorId,
    month: currentMonth,
  }).then((res) => {
    return res;
  });

  if (create) {
    return {
      status: "success",
      message: "Month skipped successfully.",
    };
  }
  return {
    status: "failed",
    message: "Something went wrong while skiping month.",
  };
};

const unSkipThisMonth = async (reqBody) => {
  const { vendorId } = reqBody;

  const currentMonth = moment().format("Y-MM");
  const check = await SkippedMonths.findOne({
    vendorId: reqBody.vendorId,
    month: currentMonth,
  }).then((res) => {
    return res;
  });
  if (check) {
    const { id } = check;
    const remove = await SkippedMonths.deleteOne({ _id: id }).then((res) => {
      return res;
    });
    if (remove) {
      return {
        status: "success",
        message: "Month un skipped successfully.",
      };
    }
  }

  return {
    status: "failed",
    message: "Data not found for un skip month.",
  };
};

module.exports = {
  registerVendor,
  loginVendor,
  removeVendor,
  getVendorDetails,
  updateVendor,
  skipThisMonth,
  unSkipThisMonth,
};
