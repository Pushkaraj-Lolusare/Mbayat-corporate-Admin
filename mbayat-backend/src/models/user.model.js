const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");
const { roles } = require("../config/roles");

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: false,
      trim: true,
    },
    last_name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
      sparse: true,
    },
    password: {
      type: String,
      required: false,
      trim: true,
      // minlength: 8,
      // validate(value) {
      //   if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
      //     throw new Error(
      //       "Password must contain at least one letter and one number"
      //     );
      //   }
      // },
      private: true, // used by the toJSON plugin
      sparse: true,
    },
    country_code: {
      type: String,
      default: null,
    },
    mobile_number: {
      type: Number,
      default: null,
    },
    date_of_birth: {
      type: String,
      default: null,
    },
    interests: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Interest" }],
      default: null,
    },
    subInterests: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubInterest" }],
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: roles,
      default: "user",
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
      default: null,
    },
    loginDetailsSent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "active",
    },
    permissions: {
      type: Array,
      default: [],
    },
    orderHandleBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isUserNameTaken = async function (username, excludeUserId) {
  const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
