const express = require('express');
const subscriptionRouter = express.Router();
const SubscriptionModel = require('../model/corporateSubscription.model');

// GET route to fetch subscriptions and their status


subscriptionRouter.get('/', async (req, res) => {
    const userId = req.body.userId;
    try {
        const subscriptions = await SubscriptionModel.find({ userId: userId }).sort({ _id: -1 });
        const currentDate = new Date();
        const subscriptionsWithStatus = subscriptions.map((subscription) => {
            if (subscription.subscriptionEndDate && currentDate > subscription.subscriptionEndDate) {
                subscription.status = 'end';
            } else {
                subscription.status = 'active';
            }
            return subscription;
        });
        res.json(subscriptionsWithStatus);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Function to generate a unique promo code
function generatePromoCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 20;
    let promoCode = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        promoCode += characters.charAt(randomIndex);
    }

    return promoCode;
}



// POST route to create a new subscription
subscriptionRouter.post('/', async (req, res) => {
    try {
        const { subscriptionPlan, quantity, subscriptionDate, userId } = req.body;


        let subscriptionEndDate;

        // Calculate subscription end date based on subscription plan
        if (subscriptionPlan === '1 month') {
            subscriptionEndDate = new Date(subscriptionDate);
            subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
        } else if (subscriptionPlan === '2 months') {
            subscriptionEndDate = new Date(subscriptionDate);
            subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 2);
        } else if (subscriptionPlan === '3 months') {
            subscriptionEndDate = new Date(subscriptionDate);
            subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 3);
        }

        const promoCodes = [];
        for (let i = 0; i < quantity; i++) {
            const promoCode = generatePromoCode(); // Replace with your logic to generate promo codes
            promoCodes.push(promoCode);
        }

        let price = 0;

        if (subscriptionPlan === '1 month') {
            price = 15;
        } else if (subscriptionPlan === '2 months') {
            price = 30;
        } else if (subscriptionPlan === '3 months') {
            price = 45;
        }

        const totalAmount = price * quantity;

        const newSubscription = new SubscriptionModel({
            subscriptionPlan,
            quantity,
            subscriptionDate,
            subscriptionEndDate,
            promoCodes,
            price,
            totalAmount,
            userId
        });

        const savedSubscription = await newSubscription.save();
        res.status(201).json(savedSubscription);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

subscriptionRouter.get('/:id', async (req, res) => {
    try {
        const subscription = await SubscriptionModel.findById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.json(subscription);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = subscriptionRouter;
