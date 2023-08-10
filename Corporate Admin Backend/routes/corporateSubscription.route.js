const express = require('express');
const subscriptionRouter = express.Router();
const SubscriptionModel = require('../model/corporateSubscription.model');

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

function generatePromoCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 20;
    let promoCode = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        promoCode += characters.charAt(randomIndex);
    }

    return { code: promoCode, status: 'active' };
}

subscriptionRouter.post('/', async (req, res) => {
    try {
        const { subscriptionPlan, quantity, subscriptionDate, userId } = req.body;

        let subscriptionEndDate;

        if (subscriptionPlan === '1 month') {
            subscriptionEndDate = new Date(subscriptionDate);
            subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
        } else if (subscriptionPlan === '3 months') {
            subscriptionEndDate = new Date(subscriptionDate);
            subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 3);
        } else if (subscriptionPlan === '6 months') {
            subscriptionEndDate = new Date(subscriptionDate);
            subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 6);
        }

        const promoCodes = [];
        for (let i = 0; i < quantity; i++) {
            const promoCode = generatePromoCode(); 
            promoCodes.push(promoCode);
        }

        let price = 0;

        if (subscriptionPlan === '1 month') {
            price = 15;
        } else if (subscriptionPlan === '3 months') {
            price = 45;
        } else if (subscriptionPlan === '6 months') {
            price = 75;
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

        await SubscriptionModel.updateMany(
            { 'promoCodes.code': { $in: promoCodes.map(code => code.code) } },
            { $set: { 'promoCodes.$.status': 'used' } }
        );

        const savedSubscription = await newSubscription.save();
        res.status(201).json(savedSubscription);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

subscriptionRouter.put('/toggle-promo', async (req, res) => {
    try {
        const { userId, promoCode, name, email } = req.body;

        const subscription = await SubscriptionModel.findOne({
            'promoCodes.code': promoCode,
            $or: [
                { userId: null },  
                { userId: userId }  
            ]
        });

        if (!subscription) {
            return res.status(404).json({ message: 'Invalid promo code or already used by someone else' });
        }

        const promoCodeIndex = subscription.promoCodes.findIndex(code => code.code === promoCode);

        if (subscription.promoCodes[promoCodeIndex].status === 'deactive') {
            return res.status(400).json({ message: 'Promo code is already deactivated' });
        }

        const subscriptionPlan = subscription.subscriptionPlan; 

        let subscriptionDuration;
        if (subscriptionPlan === '1 month') {
            subscriptionDuration = 1;
        } else if (subscriptionPlan === '3 months') {
            subscriptionDuration = 3;
        } else if (subscriptionPlan === '6 months') {
            subscriptionDuration = 6;
        }

        subscription.promoCodes[promoCodeIndex].status = 'deactive';
        subscription.promoCodes[promoCodeIndex].name = name;
        subscription.promoCodes[promoCodeIndex].email = email;

        await subscription.save();

        res.status(200).json({ 
            message: 'Promo code status toggled to deactive', 
            subscriptionDuration: subscriptionDuration 
        });
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
