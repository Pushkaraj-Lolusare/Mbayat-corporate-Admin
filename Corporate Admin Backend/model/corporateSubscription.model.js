const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  subscriptionPlan: {
    type: String,
    required: [true, 'Subscription plan is required'],
  },
  quantity: {
    type: Number,
    required: true,
  },
  subscriptionDate: {
    type: Date,
    required: true,
  },
  subscriptionEndDate: {
    type: Date,
    // default: null,
  },
  price: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  promoCodes: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: String,
}, {
  versionKey: false
});

const SubscriptionModel = mongoose.model('CorporateSubscription', subscriptionSchema);

module.exports = SubscriptionModel;
