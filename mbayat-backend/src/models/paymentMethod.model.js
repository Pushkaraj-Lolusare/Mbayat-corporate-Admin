const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const { Schema } = mongoose;

const paymentMethodSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["credit card", "debit card", "paypal", "bank transfer"],
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    default: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

paymentMethodSchema.plugin(toJSON);
paymentMethodSchema.plugin(paginate);

const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);

module.exports = PaymentMethod;
