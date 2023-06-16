const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  quantity: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Delivered', 'On Hold'],
    default: 'On Hold'
  },
  userId: {
    type: String
  }
}, {
  versionKey: false
});

const OrderModel = mongoose.model('CorporateOrder', orderSchema);

module.exports = OrderModel;
