const mongoose = require('mongoose');

const corporateCartItemSchema = new mongoose.Schema({
    imageLink: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
    }
}, {
    versionKey: false
}
);

const CorporateCartModel = mongoose.model('CorporateCartItem', corporateCartItemSchema);
module.exports = CorporateCartModel
