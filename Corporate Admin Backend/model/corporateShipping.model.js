const mongoose = require('mongoose');
const corporateShippingAddressSchema = new mongoose.Schema({
    country: {
      type: String,
      default: 'Kuwait'
    },
    state: String,
    pincode: Number,
    area: String,
    block: String,
    street: String,
    houseNo: String,
    apartment: String,
    floor: String,
    avenue: String,
    direction: String,
    userId: String,
  });

  
const CorporateShippingModel = mongoose.model('CorporateShippingAddress', corporateShippingAddressSchema);

module.exports = CorporateShippingModel;