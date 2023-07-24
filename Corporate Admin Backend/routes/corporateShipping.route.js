const express = require('express');
const CorporateShippingModel = require('../model/corporateShipping.model');
const corporateShippingRouter = express.Router();

// GET route to fetch all shipping addresses
corporateShippingRouter.get('/', async (req, res) => {
    const userId = req.body.userId
    try {
        const shippingAddresses = await CorporateShippingModel.find({ userId: userId }).sort();
        res.json(shippingAddresses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch shipping addresses' });
    }
});

// Post
corporateShippingRouter.post('/', async (req, res) => {
    try {
        const shippingAddress = await CorporateShippingModel.create(req.body);
        await shippingAddress.save();
        res.status(201).send({ msg: "Address Added", address: shippingAddress });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to create a shipping address' });
    }
});

// Put
corporateShippingRouter.put('/:addressId', async (req, res) => {
    try {
        const addressId = req.params.addressId;
        const updatedAddressData = req.body;
        const updatedAddress = await CorporateShippingModel.findByIdAndUpdate({ _id: addressId }, updatedAddressData, {
            new: true,
        });
        if (!updatedAddress) {
            return res.status(404).json({ message: 'Shipping address not found.' });
        }
        res.status(201).send({ msg: 'Address Updated' , updated: updatedAddress})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the shipping address.' });
    }
});

// Delete a shipping address
corporateShippingRouter.delete('/:addressId', async (req, res) => {
    try {
        const addressId = req.params.addressId;
        const deletedAddress = await CorporateShippingModel.findByIdAndRemove({ _id: addressId });
        if (!deletedAddress) {
            return res.status(404).json({ message: 'Shipping address not found.' });
        }
        res.status(201).send({ msg: 'Address Deleted'})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the shipping address.' });
    }
});


module.exports = corporateShippingRouter
