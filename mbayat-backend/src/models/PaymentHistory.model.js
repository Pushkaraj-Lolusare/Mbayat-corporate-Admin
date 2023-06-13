const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const paymentHistorySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    payzahRefrenceCode: {
      type: String,
      default: null,
    },
    trackId: {
      type: String,
      default: null,
    },
    knetPaymentId: {
      type: String,
      default: null,
    },
    paymentId: {
      type: String,
      default: null,
    },
    transactionNumber: {
      type: String,
      default: null,
    },
    trackingNumber: {
      type: String,
      default: null,
    },
    paymentDate: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

paymentHistorySchema.plugin(toJSON);
paymentHistorySchema.plugin(paginate);

const PaymentHistory = mongoose.model("PaymentHistory", paymentHistorySchema);

module.exports = PaymentHistory;
