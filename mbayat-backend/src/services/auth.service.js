const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const tokenService = require("./token.service");
const userService = require("./user.service");
const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");
const { User, MysteryBoxSetting, Notification } = require("../models");
const { sendNotification, generateOTP } = require("../utils/helperFunction");
const { emailService } = require("./index");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    const phone = await userService.getUserByPhone(email);
    if (!phone || !(await phone.isPasswordMatch(password))) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Incorrect email or password"
      );
    }
    return phone;
  }
  if (
    !user ||
    user.role !== "user" ||
    !(await user.isPasswordMatch(password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  await Notification.create({
    userId: user._id,
    notification: `Welcome, ${user.first_name}! Your have successfully login. Explore Mbayat and join the mystery box community.`,
  });

  return user;
};

const loginMaserAdmin = async (email, password) => {
  const user = await userService.getMasterAdminByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await refreshTokenDoc.remove();
};

const confirmOTP = async (reqBody) => {
  const { userId, otp } = reqBody;

  let isOtpConfirmed = false;
  const confirmUserOtp = await User.findOne({
    _id: userId.toString(),
    otp: Number(otp),
  })
    .then((res) => {
      if (res) {
        isOtpConfirmed = true;
        return {
          status: "success",
          message: "Otp confirmed successfully.",
        };
      }
      return {
        status: "failed",
        message: "Your entered otp is not correct.",
      };
    })
    .catch((error) => {
      return { status: "error", message: error.message };
    });

  if (isOtpConfirmed) {
    await User.updateOne({ _id: userId.toString() }, { otp: null });
    await sendNotification(userId, "Your account created successfully.");
  }

  return confirmUserOtp;
};

const confirmOTPForRestPassword = async (reqBody) => {
  const { email, otp } = reqBody;

  const findUser = await userService.getUserByEmail(email);
  if (findUser) {
    if (findUser.otp === Number(otp)) {
      return {
        status: "success",
        message: "Success! Otp confirmed.",
      };
    }
    return {
      status: "failed",
      message: "Otp is not matched, Please try again or send new otp.",
    };
  }
  return {
    status: "failed",
    message: "User not found.",
  };
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (reqBody) => {
  const { email, otp, newPassword, confirmPassword } = reqBody;

  const findUser = await userService.getUserByEmail(email);
  if (findUser) {
    if (findUser.otp === Number(otp)) {
      if (newPassword === confirmPassword) {
        const updateUser = await User.updateOne(
          {
            _id: findUser._id,
          },
          {
            otp: null,
            password: await bcrypt.hash(confirmPassword, 8),
          }
        );
        if (updateUser) {
          return {
            status: "success",
            message: "Your new password is updated successfully.",
          };
        }
        return {
          status: "failed",
          message:
            "Something went wrong while updating password, Please try again or later.",
        };
      }
      return {
        status: "failed",
        message: "New Password and Confirm Password is not matched.",
      };
    }
    return {
      status: "failed",
      message: "OTP is not matched.",
    };
  }
  return {
    status: "failed",
    message: "User is not found.",
  };
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyEmailToken,
      tokenTypes.VERIFY_EMAIL
    );
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

const userForgotPassword = async (reqBody) => {
  const { email } = reqBody;
  // await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  const checkUserIsExist = await User.findOne({ email }).then((res) => {
    return res;
  });
  if (checkUserIsExist) {
    const otp = generateOTP();
    const updateUserOTP = await User.updateOne(
      {
        _id: checkUserIsExist._id,
      },
      {
        otp,
      }
    );
    if (updateUserOTP) {
      return {
        status: "success",
        message: "Send OTP to your email successfully.",
      };
    }
    return {
      status: "failed",
      message:
        "Something went wrong while sending opt, Please try again or later.",
    };
  }
  return {
    status: "failed",
    message: "This email is not registered.",
  };
};

const getMysteryBoxSetting = async (userId) => {
  if (userId) {
    const getSetting = await MysteryBoxSetting.findOne({
      userId,
    }).then((res) => {
      return res;
    });

    if (getSetting) {
      return {
        status: "success",
        message: "Mystery Box Setting",
        data: getSetting,
      };
    }
    return {
      status: "failed",
      message: "Mystery Box setting not found",
    };
  }
  const getSetting = await MysteryBoxSetting.findOne().then((res) => {
    return res;
  });

  if (getSetting) {
    return {
      status: "success",
      message: "Mystery Box Setting",
      data: getSetting,
    };
  }
  return {
    status: "failed",
    message: "Mystery Box setting not found",
  };

  return {
    status: "failed",
    message: "Mystery Box setting not found",
  };
};

const updateMysteryBoxSetting = async (reqBody) => {
  const { id } = reqBody;

  if (id) {
    const addSetting = await MysteryBoxSetting.updateOne(
      {
        _id: id,
      },
      {
        userId: reqBody.userId,
        cutOfDate: reqBody.cutOfDate,
        autoRejectPeriod: reqBody.autoRejectPeriod,
        numberOfInterest: reqBody.numberOfInterest,
        subscriptionPerMonth: reqBody.subscriptionPerMonth,
      }
    ).then((res) => {
      return res;
    });

    if (addSetting) {
      return {
        status: "success",
        message: "Mystery Box Setting saved successfully.",
      };
    }
  } else {
    const addSetting = await MysteryBoxSetting.create({
      userId: reqBody.userId,
      cutOfDate: reqBody.cutOfDate,
      autoRejectPeriod: reqBody.autoRejectPeriod,
      numberOfInterest: reqBody.numberOfInterest,
      subscriptionPerMonth: reqBody.subscriptionPerMonth,
    }).then((res) => {
      return res;
    });

    if (addSetting) {
      return {
        status: "success",
        message: "Mystery Box Setting saved successfully.",
      };
    }
  }

  return {
    status: "failed",
    message: "Something went wrong while saving setting.",
  };
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  confirmOTP,
  loginMaserAdmin,
  userForgotPassword,
  confirmOTPForRestPassword,
  getMysteryBoxSetting,
  updateMysteryBoxSetting,
};
