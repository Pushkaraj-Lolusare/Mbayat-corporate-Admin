// orderRoutes.js

const express = require('express');
const OrderRouter = express.Router();
const OrderModel = require('../model/order.model');

// POST route to create a new order
OrderRouter.post('/', (req, res) => {
    const { productName, quantity, totalPrice, status, userId } = req.body;
    const order = new OrderModel({
        productName,
        quantity,
        totalPrice,
        status, 
        userId
    });

    order.save()
        .then(savedOrder => {
            res.json(savedOrder);
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to create order' });
        });
});

// GET route to retrieve all orders
OrderRouter.get('/', (req, res) => {
    const userId = req.body.userId;

    OrderModel.find({ userId: userId }).sort({ _id: -1 })
        .then(orders => {
            res.json(orders);
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to retrieve orders' });
        });
});

module.exports = OrderRouter;