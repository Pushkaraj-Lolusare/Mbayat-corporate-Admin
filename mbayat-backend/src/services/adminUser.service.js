const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const addAdminUser = async (reqBody) => {
  const { email, username } = reqBody;
  if (await User.isEmailTaken(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (await User.isUserNameTaken(username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }

  Object.assign(reqBody, { role: 'admin_user' });

  return User.create(reqBody)
    .then((res) => {
      if (res) {
        return {
          status: 'success',
          message: 'Admin user added successfully.',
          data: res,
        };
      }
      return {
        status: 'failed',
        message: 'Something went wrong while adding admin user.',
      };
    })
    .catch((err) => {
      return {
        status: 'error',
        message: err.message,
      };
    });
};

const adminUserLists = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

const editAdminUser = async (reqBody) => {
  const { email, username, userId } = reqBody;
  if (await User.isEmailTaken(email, userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (await User.isUserNameTaken(username, userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }

  return User.updateOne({ _id: userId }, reqBody)
    .then((res) => {
      if (res) {
        return {
          status: 'success',
          message: 'User update successfully.',
        };
      }
      return {
        status: 'failed',
        message: 'Something went wrong while updating user, Please try again or later.',
      };
    })
    .catch((err) => {
      return {
        status: 'error',
        message: err.message,
      };
    });
};

const deleteAdminUser = async (reqBody) => {
  const { userId } = reqBody;
  const getUser = await User.findOne({ _id: userId });
  if (getUser !== null) {
    const removeUser = await User.updateOne({ _id: userId }, { status: 'in_active' })
      .then((res) => {
        if (res) {
          return {
            status: 'success',
            message: 'Admin user removed successfully.',
          };
        }
        return {
          status: 'failed',
          message: 'Something went wrong while deleting user.',
        };
      })
      .catch((err) => {
        return {
          status: 'error',
          message: err.message,
        };
      });

    return removeUser;
  }
  return {
    status: 'failed',
    message: 'Something went wrong while deleting user.',
  };
};

module.exports = {
  addAdminUser,
  adminUserLists,
  editAdminUser,
  deleteAdminUser,
};
