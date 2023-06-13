const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const notificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notification: {
      type: String,
      require: true,
    },
    subscriptionDetails: {
      type: Object,
      default: null,
    },
    orderDetails: {
      type: Object,
      default: null,
    },
    paymentDetails: {
      type: Object,
      default: null,
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

const NotificationModel = mongoose.model("notification", notificationSchema);

module.exports = NotificationModel;
